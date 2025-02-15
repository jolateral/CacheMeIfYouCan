'use client';
import { useState } from 'react';
import { generateRecipe } from '@/lib/gemini';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAddIngredient = () => {
    if (currentIngredient.trim() !== '') {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    try {
      const generatedRecipe = await generateRecipe(ingredients);
      setRecipe(generatedRecipe);
      
      // Save to Firestore if user is logged in
      if (user) {
        await addDoc(collection(db, 'recipes'), {
          ...generatedRecipe,
          userId: user.uid,
          createdAt: new Date(),
          ingredients: ingredients
        });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Generate Recipe from Ingredients</h2>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter an ingredient"
        />
        <button
          onClick={handleAddIngredient}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Your Ingredients:</h3>
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center bg-gray-100 p-2 rounded-md">
              <span className="flex-1">{ingredient}</span>
              <button
                onClick={() => handleRemoveIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={handleGenerateRecipe}
        disabled={ingredients.length === 0 || loading}
        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300"
      >
        {loading ? 'Generating...' : 'Generate Recipe'}
      </button>
      
      {recipe && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          {recipe.nutritionInfo && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Nutrition Information:</h3>
              <p>{recipe.nutritionInfo}</p>
            </div>
          )}
          
          {user && (
            <p className="mt-4 text-sm text-gray-600">
              This recipe has been saved to your account.
            </p>
          )}
        </div>
      )}
    </div>
  );
}