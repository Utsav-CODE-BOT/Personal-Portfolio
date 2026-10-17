const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export class ChatService {
  static async handleStreamingResponse(response, callbacks) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';
    let buffer = '';

    try {
      while (true) {
        if (callbacks.shouldStop?.()) {
          await reader.cancel();
          callbacks.onComplete(fullMessage);
          break;
        }

        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            const match = buffer.match(/^0:(.+)$/);
            if (match) {
              try {
                const content = JSON.parse(match[1]);
                fullMessage += content;
                callbacks.onChunk(fullMessage);
              } catch (e) {
                console.error('Error parsing final chunk in buffer:', e);
              }
            }
          }
          callbacks.onComplete(fullMessage);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        // Keep the last partial line in buffer
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim() === '') continue;

          const match = line.match(/^0:(.+)$/);
          if (match) {
            try {
              const content = JSON.parse(match[1]);
              fullMessage += content;
              callbacks.onChunk(fullMessage);
              await new Promise(resolve => setTimeout(resolve, 30));
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error reading stream:', e);
      throw new Error('Error processing response stream');
    }
  }

  static async handleError(response) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: 'An error occurred while processing your request' };
    }

    if (response.status === 429) {
      return {
        isRateLimit: true,
        message: errorData.friendly_message || "You're sending messages too quickly! Please wait before sending another message.",
        retryAfter: errorData.retry_after || 30
      };
    }
    throw new Error(errorData.detail || 'Failed to send message');
  }

  static async sendMessage(chatRequest) {
    const endpoint = BACKEND_URL ? `${BACKEND_URL}/api/chat` : '/api/chat';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: chatRequest.message,
        messages: (chatRequest.messages || []).map(({ role, content }) => ({ role, content })),
        session_id: chatRequest.session_id,
        timestamp: chatRequest.timestamp || Date.now() / 1000
      }),
    });

    if (!response.ok) {
      return this.handleError(response);
    }

    return response;
  }
}