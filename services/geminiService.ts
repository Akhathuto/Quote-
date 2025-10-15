import { GoogleGenAI, Type } from "@google/genai";
import type { RFQ, Supplier } from '../types';

// Fix: Per coding guidelines, the API key must be obtained from `process.env.API_KEY`.
// This also resolves the TypeScript error with `import.meta.env`.
// The API key's presence is assumed and should not be checked.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const supplierSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The full name of the supplier company.",
      },
      website: {
        type: Type.STRING,
        description: "The official website URL of the supplier.",
      },
      location: {
        type: Type.STRING,
        description: "The physical address or city of the supplier's main office in South Africa.",
      },
      leadTime: {
        type: Type.STRING,
        description: "An estimated lead or delivery time for the requested items.",
      },
      paymentMethods: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "A list of payment methods accepted by the supplier (e.g., EFT, Credit Card, 30-day Account).",
      },
    },
    required: ["name", "website", "location", "leadTime", "paymentMethods"],
  },
};


export const findSuppliers = async (rfq: RFQ): Promise<Supplier[]> => {
  const prompt = `
    You are an expert procurement assistant for South African businesses. 
    A user needs to find suppliers for the following Request for Quotation (RFQ):

    Project Name: "${rfq.projectName}"
    Items Required: "${rfq.items}"
    
    Your task is to find the top 5 most trusted and relevant suppliers based in South Africa for these items.
    
    For each supplier, you MUST provide the following compulsory information:
    - name: The supplier's business name.
    - website: A valid, functional website URL.
    - location: The supplier's physical store or head office location in South Africa.
    - leadTime: A typical lead time for delivery of goods.
    - paymentMethods: An array of common payment methods they accept.
    
    Return the information ONLY in the specified JSON format. Do not include any introductory text or explanations outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: supplierSchema,
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
      throw new Error("Received an empty response from the AI.");
    }

    const suppliers = JSON.parse(responseText);
    return suppliers as Supplier[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fix: Updated error message to be more generic and not mention the API key, per guidelines.
    throw new Error("Failed to fetch supplier information. Please try again later.");
  }
};
