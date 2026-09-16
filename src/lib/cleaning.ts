export function cleanText(text: string): string {
  if (!text) return "";
  let cleaned = text;
  
  // Normalize obvious whitespace and repeated line breaks
  cleaned = cleaned.replace(/\r\n/g, "\n");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  
  // Remove URLs to avoid noise (very basic pattern, keeps words)
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, "[URL]");
  
  // Collapse repeated spaces but preserve single newlines
  cleaned = cleaned.replace(/[ \t]+/g, " ");
  
  return cleaned.trim();
}
