import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { ingredients } = await request.json();
  
  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  try {
    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(', ')}. 
                    Format the response as JSON with title, ingredients, instructions, and nutritionInfo fields.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON from the text response
    const recipeData = JSON.parse(text);
    
    return NextResponse.json(recipeData);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}