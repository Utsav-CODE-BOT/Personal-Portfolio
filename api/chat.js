import { defaultLimiter } from './lib/rateLimiter.js';
import { streamCompletion } from './lib/llm.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  // 1. IP extraction & Rate limit check
  const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1')
    .toString()
    .split(',')[0]
    .trim();

  const rateCheck = defaultLimiter.check(ip);
  if (!rateCheck.isAllowed) {
    return res.status(rateCheck.status).json(rateCheck.body);
  }

  // 2. Body validation
  const body = req.body || {};

  // Reject payloads > 16KB
  const rawBodyLength = JSON.stringify(body).length;
  if (rawBodyLength > 16384) {
    return res.status(400).json({ detail: 'Request body exceeds maximum size of 16 KB' });
  }

  let userMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (!userMessage || userMessage.length === 0) {
    return res.status(400).json({ detail: 'Message cannot be empty' });
  }
  if (userMessage.length > 1000) {
    return res.status(400).json({ detail: 'Message cannot exceed 1000 characters' });
  }

  // Strip non-printable control characters
  userMessage = userMessage.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  const history = Array.isArray(body.messages) ? body.messages : [];
  if (history.length > 40) {
    return res.status(400).json({ detail: 'Maximum 40 history messages allowed' });
  }

  for (const item of history) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') {
      return res.status(400).json({ detail: 'Invalid history message item' });
    }
  }

  // 3. Setup SSE streaming headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  try {
    const stream = streamCompletion(userMessage, history, process.env);
    for await (const chunk of stream) {
      res.write(chunk);
      if (typeof res.flush === 'function') {
        res.flush();
      }
    }
    res.end();
  } catch (error) {
    console.error('Error during streaming response:', error);
    if (!res.headersSent) {
      res.status(500).json({ detail: 'An error occurred while processing your request' });
    } else {
      res.write(`0:${JSON.stringify("I apologize, but I encountered an error while processing your request. Please try again.")}\n`);
      res.end();
    }
  }
}
