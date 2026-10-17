import { describe, it, expect, beforeEach } from 'vitest';
import { chunkMarkdown } from '../../../api/lib/chunker.js';
import { retrieveRelevantChunks, getIndexedChunks } from '../../../api/lib/knowledge.js';
import { RateLimiter } from '../../../api/lib/rateLimiter.js';
import { buildSystemPrompt, buildMessages } from '../../../api/lib/llm.js';

describe('Serverless API & Logic Suite', () => {
  describe('Markdown Chunker', () => {
    it('splits markdown text into chunks respecting headings and paragraphs', () => {
      const markdown = `# Title\n\nFirst paragraph with content.\n\n## Section 1\n\nSecond paragraph here.\n\n### Subsection\n\nThird paragraph.`;
      const chunks = chunkMarkdown(markdown, 100, 20);
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[0]).toContain('Title');
    });

    it('handles empty or non-string input safely', () => {
      expect(chunkMarkdown('')).toEqual([]);
      expect(chunkMarkdown(null)).toEqual([]);
      expect(chunkMarkdown(undefined)).toEqual([]);
    });
  });

  describe('Knowledge Retrieval', () => {
    it('indexes knowledge chunks from raw documentation', () => {
      const chunks = getIndexedChunks();
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.some(c => c.content.includes('Utsav D'))).toBe(true);
    });

    it('returns top 4 relevant chunks based on query scoring', () => {
      const results = retrieveRelevantChunks('Robotics 6-DOF manipulator simulation kinematics', 4);
      expect(results.length).toBeLessThanOrEqual(4);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].content.toLowerCase()).toContain('robotic');
    });

    it('returns top 4 chunks for generic or empty query', () => {
      const results = retrieveRelevantChunks('', 4);
      expect(results.length).toBeLessThanOrEqual(4);
    });
  });

  describe('Rate Limiter', () => {
    let limiter;

    beforeEach(() => {
      limiter = new RateLimiter({
        chatRate: '2/minute',
        globalRate: '5/hour'
      });
    });

    it('allows requests within the rate limits', () => {
      const res1 = limiter.check('192.168.1.1');
      expect(res1.isAllowed).toBe(true);

      const res2 = limiter.check('192.168.1.1');
      expect(res2.isAllowed).toBe(true);
    });

    it('returns standardized 429 response when per-IP chat limit is exceeded', () => {
      limiter.check('10.0.0.1'); // 1
      limiter.check('10.0.0.1'); // 2
      const res3 = limiter.check('10.0.0.1'); // 3 (exceeded)

      expect(res3.isAllowed).toBe(false);
      expect(res3.status).toBe(429);
      expect(res3.body).toEqual({
        detail: 'Chat rate limit exceeded',
        type: 'chat_rate_limit_exceeded',
        limit: '2/minute',
        retry_after: expect.any(Number),
        friendly_message: "You're sending messages too quickly! Please wait before sending another message."
      });
    });

    it('returns standardized 429 response when global limit is exceeded', () => {
      const strictLimiter = new RateLimiter({
        chatRate: '100/minute',
        globalRate: '2/hour'
      });

      strictLimiter.check('1.1.1.1'); // 1
      strictLimiter.check('2.2.2.2'); // 2
      const res = strictLimiter.check('3.3.3.3'); // 3

      expect(res.isAllowed).toBe(false);
      expect(res.status).toBe(429);
      expect(res.body.type).toBe('rate_limit_exceeded');
    });
  });

  describe('LLM Message Assembly & System Prompt', () => {
    it('truncates conversation history to the last 10 messages', () => {
      const history = Array.from({ length: 25 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i + 1}`
      }));

      const assembled = buildMessages('System Prompt', history, 'Latest User Message');
      
      // Assembled must be: 1 system + 10 history + 1 latest user = 12 messages
      expect(assembled.length).toBe(12);
      expect(assembled[0].role).toBe('system');
      expect(assembled[1].content).toBe('Message 16');
      expect(assembled[assembled.length - 1].content).toBe('Latest User Message');
    });

    it('includes prompt injection guards and strict persona rules in system prompt', () => {
      const prompt = buildSystemPrompt('Context documentation here');
      expect(prompt).toContain('Utsav D');
      expect(prompt).toContain('Security Guardrail');
      expect(prompt).toContain('third person');
      expect(prompt).toContain('Markdown');
      expect(prompt).toContain('Context documentation here');
    });

    it('formats stream frame with 0:"<json_chunk>"\\n pattern', () => {
      const chunk = 'Hello world';
      const frame = `0:${JSON.stringify(chunk)}\n`;
      expect(frame).toBe('0:"Hello world"\n');

      const match = frame.match(/^0:(.+)$/m);
      expect(match).toBeTruthy();
      expect(JSON.parse(match[1])).toBe('Hello world');
    });
  });
});
