import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export interface ClothingAnalysis {
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'hatwear';
  tags: string[];
}

export async function analyzeClothingImage(imageBuffer: Buffer, mimeType: string): Promise<ClothingAnalysis> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Analyze this clothing item image and return ONLY valid JSON with no markdown or extra text:
{
  "name": "short descriptive name (2-4 words)",
  "category": "one of: tops, bottoms, outerwear, footwear, accessories, hatwear",
  "tags": ["3-6 tags covering color, style, occasion, or material"]
}`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBuffer.toString('base64'), mimeType } },
  ]);

  const text = result.response.text().trim();
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  const parsed = JSON.parse(cleaned) as ClothingAnalysis;
  return parsed;
}
