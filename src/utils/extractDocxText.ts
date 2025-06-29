import mammoth from "mammoth";

export async function extractInfo(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  const response = cleanText(value);
  return response;
}

function cleanText(text: string): string {
  return text
    .split("\n")
    .map(line => line.replace(/\s+/g, " ").trim())
    .filter(line => line !== "")
    .join("\n");
}