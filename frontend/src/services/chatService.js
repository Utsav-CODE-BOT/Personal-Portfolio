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
          if (buffer.trim()) {
            const match = buffer.match(/^0:(.+)$/);
            if (match) {
              try {
                const parsed = JSON.parse(match[1]);
                const text = typeof parsed === 'string' ? parsed : (parsed?.chunk || '');
                fullMessage += text;
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
        let lines = [];

        if (buffer.includes('\n')) {
          lines = buffer.split('\n');
          buffer = lines.pop(); // keep partial line for next iteration
        } else if (buffer.startsWith('0:')) {
          // If a chunk doesn't have a trailing newline (e.g. in unit tests), check if it is complete JSON
          try {
            const raw = buffer.slice(2).trim();
            JSON.parse(raw);
            lines = [buffer];
            buffer = '';
          } catch {
            // Incomplete JSON, wait for next chunk
          }
        }

        for (const line of lines) {
          if (line.trim() === '') continue;

          const match = line.match(/^0:(.+)$/);
          if (match) {
            try {
              const parsed = JSON.parse(match[1]);
              const text = typeof parsed === 'string' ? parsed : (parsed?.chunk || '');
              fullMessage += text;
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
    const errorData = await response.json();
    if (response.status === 429) {
      return {
        isRateLimit: true,
        message: errorData.friendly_message || "You've reached the rate limit. Please wait before sending more messages.",
        retryAfter: errorData.retry_after
      };
    }
    throw new Error(errorData.detail || 'Failed to send message');
  }

  static async sendMessage(chatRequest) {
    const endpoint = BACKEND_URL ? `${BACKEND_URL}/chat` : '/api/chat';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...chatRequest,
        messages: (chatRequest.messages || []).map(({ role, content }) => ({ role, content }))
      }),
    });

    if (!response.ok) {
      return this.handleError(response);
    }

    return response;
  }
}
