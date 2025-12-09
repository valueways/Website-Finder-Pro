import { GoogleGenAI } from "@google/genai";
import { Business } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findBusinesses = async (query: string): Promise<Business[]> => {
  try {
    const prompt = `
      Find businesses matching the query: "${query}".
      
      I need a detailed list of at least 10-15 businesses if possible.
      For each business, I specifically need to know if they have a website URL.
      
      Return the data strictly as a JSON array of objects. 
      Do NOT use Markdown code blocks. Just the raw JSON string.
      
      Each object must have these fields:
      - name (string)
      - address (string)
      - phoneNumber (string or null)
      - website (string URL or null/empty string if not found)
      - rating (number or null)
      - reviewCount (number or null)
      - category (string)
      - openStatus (string e.g. "Open Now", "Closed")
      
      Make sure to accurately report the 'website' field. If the Google Maps data doesn't show a website, leave it empty or null.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // Note: We cannot use responseSchema or responseMimeType when using googleMaps tool.
        // We must rely on the prompt to format the output as JSON.
        temperature: 0.4,
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No data received from Gemini.");
    }

    // Clean up markdown if Gemini decides to wrap it despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const data = JSON.parse(cleanText);
      
      // Transform and validate data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const businesses: Business[] = data.map((item: any, index: number) => ({
        id: `biz-${Date.now()}-${index}`,
        name: item.name || "Unknown Business",
        address: item.address || "No address provided",
        phoneNumber: item.phoneNumber || undefined,
        website: item.website || undefined,
        rating: item.rating || undefined,
        reviewCount: item.reviewCount || 0,
        category: item.category || "General",
        openStatus: item.openStatus || undefined,
      }));

      return businesses;
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", text);
      throw new Error("Failed to process business data. Please try again.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateLeadPrompt = (business: Business): string => {
  return `Build a business website for "${business.name}" located at "${business.address}". 
Industry: ${business.category || 'General Business'}. 
Their phone number is ${business.phoneNumber || 'Not listed'}. 
They currently do not have a website. 
Create a modern, responsive, SEO-optimized website suitable for their business. Include sections for Home, About, Services, and Contact.`;
};