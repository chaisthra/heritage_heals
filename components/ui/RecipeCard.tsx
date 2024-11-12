import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

interface RecipeCardProps {
  name: string;
  description: string;
  time: string;
  image: string;
  icons: string[];
  rating: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ name, description, time, image, icons, rating }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [upvotes, setUpvotes] = useState(rating);
  const [recipeDetails, setRecipeDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isHovered && !recipeDetails && !isLoading) {
      generateRecipe();
    }
  }, [isHovered, recipeDetails, isLoading]);

  const generateRecipe = async () => {
    console.log('Generating recipe for:', name);
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a detailed recipe for ${name}. Include ingredients, instructions, and nutritional information.`;
      console.log('Sending prompt to Gemini API:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      console.log('Generated recipe:', generatedText);
      setRecipeDetails(generatedText);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipeDetails(`Failed to generate recipe for ${name}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = () => {
    setUpvotes(prev => Math.min(prev + 1, 100));
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md overflow-hidden rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-sm mb-2">{description}</p>
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{time}</span>
        </div>
        <div className="flex items-center mb-2">
          {icons.map((icon, index) => (
            <svg key={index} className="w-4 h-4 mr-1 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          ))}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={handleUpvote}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <motion.div
              className="h-2.5 rounded-full"
              style={{
                background: `linear-gradient(90deg, #EF4444 0%, #10B981 100%)`,
                width: `${upvotes}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${upvotes}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-4 bg-white/20 backdrop-blur-md"
        >
          <h4 className="text-lg font-semibold mb-2">Recipe Details</h4>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : recipeDetails ? (
            <p className="text-sm whitespace-pre-wrap">{recipeDetails}</p>
          ) : (
            <p className="text-sm">Hover to load recipe details</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecipeCard;