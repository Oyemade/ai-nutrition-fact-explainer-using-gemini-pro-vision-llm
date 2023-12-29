import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

import * as dotenv from "dotenv";
dotenv.config();

const template = `Task: Analyze images of nutritional facts from various products, which feature diverse designs and include detailed nutritional information typically found on food packaging.

Step 1: Image Recognition and Verification

Confirm if each image is a nutritional facts label.
If the image is not a nutritional facts label, return: "Image not recognized as a nutritional facts label."
Step 2: Data Extraction and Nutritional Analysis

Extract and list the key nutritional contents from the label, such as calories, fats, carbohydrates, proteins, vitamins, minerals and other nutritional details.
Step 3: Reporting in a Strict Two-Sentence Format

First Sentence (Nutritional Content Listing): Clearly list the main nutritional contents. Example: "This product contains 200 calories, 10g of fat, 5g of sugar, and 10g of protein per serving."
Second Sentence (Diet-Related Insight): Provide a brief, diet-related insight based on the nutritional content. Example: "Its high protein and low sugar content make it a suitable option for muscle-building diets and those managing blood sugar levels."
Note: The response must strictly adhere to the two-sentence format, focusing first on listing the nutritional contents, followed by a concise dietary insight.
`;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const image = [fileToGenerativePart("./pepsi.jpg", "image/jpeg")];

const result = await model.generateContent([template, ...image]);
const response = await result.response;
const text = response.text();
console.log(text);
