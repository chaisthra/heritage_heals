'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Leaf, Wheat, Milk, Clock, ThumbsUp } from "lucide-react"
import Link from "next/link"
import IngredientIdentifier from '@/components/IngredientIdentifier'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import RecipeCard from '@/components/ui/RecipeCard';

export function LandingPage() {
  const [gender, setGender] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [timeAvailable, setTimeAvailable] = useState('')
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedIndianRegions, setSelectedIndianRegions] = useState<string[]>([])
  
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null);
  const cuisines = [
    "Indian", "Italian", "Chinese", "Japanese", "Thai", "Mexican", "French", 
    "Greek", "Spanish", "Lebanese", "Turkish", "Vietnamese", "Korean", 
    "American", "Mediterranean"
  ]

  const indianRegions = [
    "North Indian", "South Indian", "East Indian", "West Indian", "Central Indian",
    "Punjabi", "Bengali", "Gujarati", "Maharashtrian", "Rajasthani", "Goan", 
    "Kashmiri", "Kerala", "Tamil", "Andhra"
  ]

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    )
  }

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    )
  }

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    )
  }

  const toggleIndianRegion = (region: string) => {
    setSelectedIndianRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  const handleFindRemedies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requestBody = {
        illness: (document.querySelector('input[placeholder="Illness/Concern"]') as HTMLInputElement)?.value,
        age: (document.querySelector('input[placeholder="Age"]') as HTMLInputElement)?.value,
        gender,
        dietaryInfo: (document.querySelector('input[placeholder="Dietary/Allergen Info"]') as HTMLInputElement)?.value,
        preferences: selectedPreferences,
        allergies: selectedAllergies,
        timeAvailable,
        selectedCuisines,
        selectedIndianRegions,
      };
  
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Generated recipe:', data.recipe);
      setGeneratedRecipe(data.recipe);
    } catch (error) {
      console.error('Error in handleFindRemedies:', error);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const formatRecipe = (recipe: string) => {
    return recipe.split('**').map((part, index) => 
      index % 2 === 0 ? part : (
        <strong 
          key={index} 
          className="font-bold bg-[#D4A373] text-white px-2 py-0.5 rounded-md"
        >
          {part}
        </strong>
      )
    );
  };
  const [recipes, setRecipes] = useState([
  {
    name: "Turmeric Golden Milk",
    description: "A soothing drink to boost immunity and reduce inflammation.",
    time: "10 mins",
    image: "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/02/Golden-Milk-5.jpg",
    icons: ["Leaf", "Milk"],
    rating: 95
  },
  {
    name: "Ginger Lemon Tea",
    description: "A warming remedy for colds and sore throats.",
    time: "15 mins",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/beverages/Ginger_lemon_tea_recipe.jpg",
    icons: ["Leaf"],
    rating: 88
  },
  {
    name: "Khichdi",
    description: "A comforting rice and lentil dish for upset stomachs.",
    time: "30 mins",
    image: "https://foodtrails25.com/wp-content/uploads/2019/04/Yellow-Moong-Dal-Khichdi-Recipe.jpg",
    icons: ["Wheat", "Leaf"],
    rating: 92
  },
  {
    name: "Tulsi Basil Tea",
    description: "An aromatic tea to relieve stress and boost respiratory health.",
    time: "5 mins",
    image: "https://www.organicfacts.net/wp-content/uploads/tulsitea.jpg",
    icons: ["Leaf"],
    rating: 90
  },
  {
    name: "Ajwain Water",
    description: "A simple remedy for indigestion and bloating.",
    time: "5 mins",
    image: "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2022/12/ajwain-water-1671708536.jpg",
    icons: ["Leaf"],
    rating: 85
  },
  {
    name: "Cinnamon Honey Mix",
    description: "A natural remedy to boost metabolism and fight infections.",
    time: "5 mins",
    image: "https://www.healthifyme.com/blog/wp-content/uploads/2022/05/shutterstock_524597692-1.jpg",
    icons: ["Leaf", "Wheat"],
    rating: 89
  }]);

  const [exploreMore, setExploreMore] = useState(false);

  const handleExploreMore = async () => {
    setExploreMore(true);
    // Here you would typically fetch more recipes from an API
    // For this example, we'll just duplicate the existing recipes
    setRecipes(prevRecipes => [...prevRecipes, ...prevRecipes]);
  };

  
  const iconComponents = {
    Leaf,
    Wheat,
    Milk,
    Clock,
    ThumbsUp
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B7E6A] via-[#6B8E4E] to-[#D4A373] text-white font-sans">
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Heritage Heals: Traditional Remedies & Comfort Food</h1>
          <p className="text-xl">Discover time-honored home remedies and comfort foods tailored to your health and wellness needs</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Input Form */}
        <section className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personalize Your Remedies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Illness/Concern" className="bg-white/20 placeholder-white/60 text-white" />
            <Input type="number" placeholder="Age" className="bg-white/20 placeholder-white/60 text-white" />
            <div className="flex gap-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <Button
                  key={g}
                  variant={gender === g ? 'default' : 'outline'}
                  onClick={() => setGender(g)}
                  className={`flex-1 ${gender === g ? 'bg-[#6B8E4E]' : 'bg-white/20'}`}
                >
                  {g}
                </Button>
              ))}
            </div>
            <Input placeholder="Dietary/Allergen Info" className="bg-white/20 placeholder-white/60 text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-2">Preferences:</label>
              <div className="flex flex-wrap gap-2">
                {['Veg', 'Non-veg', 'Vegan', 'Dairy-free', 'Gluten-free', 'Jain'].map((pref) => (
                  <Button 
                    key={pref} 
                    variant={selectedPreferences.includes(pref) ? "default" : "outline"} 
                    className={`bg-white/20 text-white ${selectedPreferences.includes(pref) ? 'bg-[#6B8E4E]' : ''}`}
                    onClick={() => togglePreference(pref)}
                  >
                    {pref}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2">Allergies:</label>
              <div className="flex flex-wrap gap-2">
                {['Milk', 'Eggs', 'Peanuts', 'Tree nuts', 'Shellfish', 'Fish', 'Wheat', 'Soy', 'Sesame'].map((allergy) => (
                  <Button 
                    key={allergy} 
                    variant={selectedAllergies.includes(allergy) ? "default" : "outline"} 
                    className={`bg-white/20 text-white ${selectedAllergies.includes(allergy) ? 'bg-[#6B8E4E]' : ''}`}
                    onClick={() => toggleAllergy(allergy)}
                  >
                    {allergy}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Select
            value={timeAvailable}
            onValueChange={setTimeAvailable}
          >
            <SelectTrigger className="mt-4 bg-white/20 text-white placeholder-white/60">
              <SelectValue placeholder="Time Available" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="25">25 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="180">3 hours or more</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Select Cuisines:</h3>
            <div className="grid grid-cols-3 gap-2">
              {cuisines.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox 
                    id={cuisine} 
                    checked={selectedCuisines.includes(cuisine)}
                    onCheckedChange={() => toggleCuisine(cuisine)}
                  />
                  <label 
                    htmlFor={cuisine}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cuisine}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedCuisines.includes('Indian') && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Select Indian Regions:</h3>
              <div className="grid grid-cols-3 gap-2">
                {indianRegions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox 
                      id={region} 
                      checked={selectedIndianRegions.includes(region)}
                      onCheckedChange={() => toggleIndianRegion(region)}
                    />
                    <label 
                      htmlFor={region}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {region}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          
        </section>
{/* Ingredient Identifier Section */}
<section className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8">
<h2 className="text-2xl font-semibold mb-4">Find Remedies Based on Your Ingredients</h2>
  <p className="mb-4">Upload a photo of your fridge contents to get AI-powered ingredient identification.</p>
  <IngredientIdentifier />
  <div className="flex justify-center mt-6">
    <Button
      className={`bg-[#D4A373] hover:bg-[#C39366] transition-all duration-300 ease-in-out transform hover:scale-105 ${
        isLoading ? 'animate-pulse' : ''
      }`}
      onClick={handleFindRemedies}
      disabled={isLoading}
    >
      {isLoading ? 'Finding Remedies...' : 'Find Remedies'}
    </Button>
  </div>
  {isLoading && (
  <div className="mt-4 text-center">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    <p className="mt-2">Generating your recipe...</p>
  </div>
)}
  {generatedRecipe && (
    <section className="mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-[#D4A373]">Generated Recipe</h2>
      <div className="whitespace-pre-wrap text-black">{formatRecipe(generatedRecipe)}</div>
    </section>
  )}
</section>
        {/* Recipe Suggestions */}
        <section>
        <h2 className="text-2xl font-semibold mb-4">Recommended Remedies & Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-black/30 text-white py-8 mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">About Heritage Heals</h3>
              <p className="text-sm">Rediscover the wisdom of traditional healing and comfort food with Heritage Heals.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Links</h3>
              <ul className="text-sm">
                <li><Link href="#" className="hover:underline">WEAL</Link></li>
                <li><Link href="#" className="hover:underline">Culinaria</Link></li>
                <li><Link href="#" className="hover:underline">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Disclaimer</h3>
              <p className="text-sm">Please consult healthcare professionals before trying any remedies. Our suggestions are based on traditional knowledge and not intended as medical advice.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cultural Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-repeat opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
    </div>
  )
}