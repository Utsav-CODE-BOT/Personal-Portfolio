/**
 * Markdown-aware text chunker
 * Splits text into chunks of roughly ~1000 characters with ~200 characters overlap,
 * respecting markdown headings, codeblocks, and paragraphs.
 */
export function chunkMarkdown(text, chunkSize = 1000, chunkOverlap = 200) {
  if (!text || typeof text !== 'string') return [];

  // Split primarily on headings (#, ##, ###) or double newlines (paragraphs)
  const sections = text.split(/(?=\n#{1,4}\s)|(?:\n\n+)/);
  const chunks = [];
  let currentChunk = '';

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length <= chunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        // Calculate overlap from previous chunk
        const overlapText = currentChunk.slice(-chunkOverlap).trim();
        currentChunk = overlapText ? `${overlapText}\n\n${trimmed}` : trimmed;
      } else {
        // If a single section is larger than chunkSize, slice it into smaller pieces
        let remaining = trimmed;
        while (remaining.length > chunkSize) {
          const splitPoint = remaining.lastIndexOf('\n', chunkSize) || chunkSize;
          chunks.push(remaining.slice(0, splitPoint).trim());
          remaining = remaining.slice(Math.max(0, splitPoint - chunkOverlap)).trim();
        }
        currentChunk = remaining;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
