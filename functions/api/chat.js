import { defaultLimiter } from '../../api/lib/rateLimiter.js';
import { streamCompletion } from '../../api/lib/llm.js';

export async function onRequestPost(context) {
  const { request } = context;
  const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

  // 1. Rate limit
  const rateCheck = defaultLimiter.check(clientIp);
  if (!rateCheck.isAllowed) {
    return new Response(JSON.stringify(rateCheck.body), {
      status: rateCheck.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Validate Body
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ detail: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let userMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (!userMessage || userMessage.length === 0) {
    return new Response(JSON.stringify({ detail: 'Message cannot be empty' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (userMessage.length > 1000) {
    return new Response(JSON.stringify({ detail: 'Message cannot exceed 1000 characters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  if (history.length > 40) {
    return new Response(JSON.stringify({ detail: 'Maximum 40 history messages allowed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3. SSE Stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = streamCompletion(userMessage, history, context.env);
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error('Streaming error in Cloudflare Pages Function:', err);
        controller.enqueue(encoder.encode(`0:${JSON.stringify("I apologize, but I encountered an error while processing your request. Please try again.")}\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no'
    }
  });
}
