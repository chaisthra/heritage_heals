import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      illness,
      age,
      gender,
      dietaryInfo,
      preferences,
      allergies,
      timeAvailable,
      selectedCuisines,
      selectedIndianRegions
    } = body;

    // Input validation
    if (!illness || !age || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = generatePrompt({
      illness,
      age,
      gender,
      dietaryInfo,
      preferences,
      allergies,
      timeAvailable,
      selectedCuisines,
      selectedIndianRegions
    });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipeText = response.text();

    // Note: Image generation is not included here. You might need a separate service for this.

    return NextResponse.json({ recipe: recipeText });
  } catch (error) {
    console.error('Error generating recipe:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred while generating the recipe' }, { status: 500 });
  }
}

interface PromptInputs {
  illness: string;
  age: string | number;
  gender: string;
  dietaryInfo?: string;
  preferences?: string[];
  allergies?: string[];
  timeAvailable?: string | number;
  selectedCuisines?: string[];
  selectedIndianRegions?: string[];
}

function generatePrompt(userInputs: PromptInputs): string {
  const {
    illness,
    age,
    gender,
    dietaryInfo = 'None specified',
    preferences = [],
    allergies = [],
    timeAvailable = 'Not specified',
    selectedCuisines = [],
    selectedIndianRegions = []
  } = userInputs;

  const preferencesString = preferences.length > 0 ? preferences.join(', ') : 'None specified';
  const allergiesString = allergies.length > 0 ? allergies.join(', ') : 'None specified';
  const cuisinesString = selectedCuisines.length > 0 ? selectedCuisines.join(', ') : 'Any cuisine';
  const indianRegionsString = selectedCuisines.includes('Indian') && selectedIndianRegions.length > 0
    ? `Indian regions of interest: ${selectedIndianRegions.join(', ')}`
    : '';

  return `Generate a traditional home remedy or comfort food recipe for a ${age}-year-old ${gender} 
    with ${illness}. The recipe should consider the following:

    Dietary information: ${dietaryInfo}
    Preferences: ${preferencesString}
    Allergies to avoid: ${allergiesString}
    Time available for preparation: ${timeAvailable} minutes
    Preferred cuisines: ${cuisinesString}
    ${indianRegionsString}
    
    Please provide a detailed recipe including:
    1. A list of ingredients with quantities
    2. Step-by-step preparation instructions
    3. Cooking time and serving size
    4. Any traditional health benefits associated with the ingredients or the dish itself
    5. A brief explanation of how this recipe may help with the specified illness (${illness})
    
    Ensure the recipe is safe, taking into account any allergies mentioned, and appropriate for the age and gender specified.
    If possible, suggest variations or substitutions to accommodate different dietary needs or preferences.`;
}