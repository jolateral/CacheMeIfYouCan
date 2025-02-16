'use client';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Heart } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function RecipePage() {
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState({});

  const meals = ['Breakfast', 'Lunch', 'Dinner'];
  const users = ['TestUser (ME)', 'TestUser 1', 'TestUser 2'];

  const generateRecipes = async () => {
    if (!selectedMeal || !selectedUser || !ingredients) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setRecipes([]);
    setSelectedRecipe(null);
    setRecipeDetails({});
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Generate 2 healthy ${selectedMeal.toLowerCase()} recipes using these ingredients: ${ingredients}. 
        Format each recipe with just a title. Make the recipes suitable for ${selectedUser}.
        Keep each recipe title under 50 characters.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const recipesList = text.split('\n').filter(line => line.trim().length > 0);
      setRecipes(recipesList.slice(0, 2));
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Failed to generate recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRecipeDetails = async (recipe, index) => {
    setLoadingDetails(true);
    setSelectedRecipe(index);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Create a detailed recipe for "${recipe}" that's ${selectedMeal.toLowerCase()} appropriate.
        Include:
        1. Preparation time
        2. Cooking time
        3. Total time
        4. Servings
        5. Ingredients with quantities
        6. Step-by-step instructions
        7. Nutritional information (calories, protein, carbs, fats)
        8. Tags (e.g., "High protein", "Low carb", etc.)`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setRecipeDetails(prevDetails => ({
        ...prevDetails,
        [index]: text
      }));
    } catch (error) {
      console.error('Error getting recipe details:', error);
      alert('Failed to get recipe details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const saveRecipe = async (recipe, index) => {
    if (!auth.currentUser) {
      alert('Please sign in to save recipes');
      return;
    }

    try {
      // Parse recipe details to extract timing and features
      const details = recipeDetails[index] || '';
      const timeMatch = details.match(/Total time: (\d+)/i);
      const proteinMatch = details.match(/Protein: (\d+)g/i);
      const caloriesMatch = details.match(/Calories: (\d+)/i);

      const recipeData = {
        title: recipe,
        details: details,
        savedAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        meal: selectedMeal,
        ingredients: ingredients,
        nutritionalInfo: {
          protein: proteinMatch ? 'High protein' : 'Balanced protein',
          time: timeMatch ? `${timeMatch[1]} min` : '30 min',
          feature: caloriesMatch && caloriesMatch[1] < 500 ? 'Low calorie' : 'Nutrient rich'
        }
      };

      const recipeRef = doc(collection(db, 'savedRecipes'));
      await setDoc(recipeRef, recipeData);

      setSavedRecipes(prev => ({
        ...prev,
        [index]: true
      }));

      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-500 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Filters */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white mb-8">🍓 Filters</h2>
          
          {/* Meal Selection */}
          <div className="flex gap-4">
            {meals.map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`py-2 px-6 rounded-full transition-colors ${
                  selectedMeal === meal 
                    ? 'bg-white text-green-600' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>

          {/* User Selection */}
          <div>
            <h3 className="text-white text-xl mb-4">Who are you cooking for?</h3>
            <div className="flex gap-4 flex-wrap">
              {users.map((user) => (
                <button
                  key={user}
                  onClick={() => setSelectedUser(user)}
                  className={`py-2 px-6 rounded-full transition-colors ${
                    selectedUser === user 
                      ? 'bg-white text-green-600' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {user}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Input */}
          <div>
            <h3 className="text-white text-xl mb-4">What's in your Fridge?</h3>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Type ingredients briefly..."
              className="w-full p-3 rounded-lg border-2 border-transparent focus:border-green-600 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={generateRecipes}
              className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition-colors"
            >
              Generate Recipes
            </button>
            <button
              onClick={() => {
                setSelectedMeal('');
                setSelectedUser('');
                setIngredients('');
                setRecipes([]);
                setSelectedRecipe(null);
                setRecipeDetails({});
              }}
              className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition-colors"
            >
              Clear Filter
            </button>
          </div>
        </div>

        {/* Right Column - Generated Recipes */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white mb-8">🥕 Generated Recipes</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white ml-4">Loading...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recipes.map((recipe, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => getRecipeDetails(recipe, index)}
                      className="text-xl font-semibold text-green-600 text-left hover:text-green-700"
                    >
                      {recipe}
                    </button>
                    <button
                      onClick={() => saveRecipe(recipe, index)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          savedRecipes[index] ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {selectedRecipe === index && (
                    <div className="mt-4">
                      {loadingDetails ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                          <p className="text-green-600 ml-2">Loading details...</p>
                        </div>
                      ) : (
                        recipeDetails[index] && (
                          <ReactMarkdown className="mt-4 border-t pt-4 whitespace-pre-line">
                            {recipeDetails[index]}
                          </ReactMarkdown>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useState } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import ReactMarkdown from 'react-markdown';

// // Initialize Gemini API
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// export default function RecipePage() {
//   const [selectedMeal, setSelectedMeal] = useState('');
//   const [selectedUser, setSelectedUser] = useState('');
//   const [ingredients, setIngredients] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [recipeDetails, setRecipeDetails] = useState({});
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   const meals = ['Breakfast', 'Lunch', 'Dinner'];
//   const users = ['TestUser (ME)', 'TestUser 1', 'TestUser 2'];

//   const generateRecipes = async () => {
//     if (!selectedMeal || !selectedUser || !ingredients) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     setRecipes([]);
//     setSelectedRecipe(null);
//     setRecipeDetails({});
    
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
//       const prompt = `Generate 2 healthy ${selectedMeal.toLowerCase()} recipes using these ingredients: ${ingredients}. 
//         Format each recipe with just a title. Make the recipes suitable for ${selectedUser}.
//         Keep each recipe title under 50 characters.`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();
      
//       // Parse the response to get individual recipes
//       const recipesList = text.split('\n').filter(line => line.trim().length > 0);
//       setRecipes(recipesList.slice(0, 2)); // Take only first two recipes
//     } catch (error) {
//       console.error('Error generating recipes:', error);
//       alert('Failed to generate recipes. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getRecipeDetails = async (recipe, index) => {
//     setLoadingDetails(true);
//     setSelectedRecipe(index);
    
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
//       const prompt = `Create a detailed recipe for "${recipe}" using these ingredients: ${ingredients}.
//         The recipe should be suitable for ${selectedUser} and for ${selectedMeal.toLowerCase()}.
//         Format the response with these sections:
//         1. Ingredients (with quantities)
//         2. Step-by-step instructions
//         3. Nutritional information (estimate)
//         4. Preparation time
//         5. Cooking time`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();
      
//       // Store the details for this specific recipe
//       setRecipeDetails(prevDetails => ({
//         ...prevDetails,
//         [index]: text
//       }));
//     } catch (error) {
//       console.error('Error getting recipe details:', error);
//       alert('Failed to get recipe details. Please try again.');
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-500 p-8">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column - Filters */}
//         <div className="space-y-8">
//           <h2 className="text-4xl font-bold text-white mb-8">🍓 Filters:</h2>
          
//           {/* Meal Selection */}
//           <div className="flex gap-4">
//             {meals.map((meal) => (
//               <button
//                 key={meal}
//                 onClick={() => setSelectedMeal(meal)}
//                 className={`py-2 px-6 rounded-full transition-colors ${
//                   selectedMeal === meal 
//                     ? 'bg-white text-green-600' 
//                     : 'bg-green-600 text-white hover:bg-green-700'
//                 }`}
//               >
//                 {meal}
//               </button>
//             ))}
//           </div>

//           {/* User Selection */}
//           <div>
//             <h3 className="text-white text-xl mb-4">Who are you cooking for?</h3>
//             <div className="flex gap-4 flex-wrap">
//               {users.map((user) => (
//                 <button
//                   key={user}
//                   onClick={() => setSelectedUser(user)}
//                   className={`py-2 px-6 rounded-full transition-colors ${
//                     selectedUser === user 
//                       ? 'bg-white text-green-600' 
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                 >
//                   {user}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Ingredients Input */}
//           <div>
//             <h3 className="text-white text-xl mb-4">What's in your Fridge?</h3>
//             <input
//               type="text"
//               value={ingredients}
//               onChange={(e) => setIngredients(e.target.value)}
//               placeholder="Type ingredients briefly..."
//               className="w-full p-3 rounded-lg border-2 border-transparent focus:border-green-600 outline-none"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             <button
//               onClick={generateRecipes}
//               className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition-colors"
//             >
//               Generate Recipes
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedMeal('');
//                 setSelectedUser('');
//                 setIngredients('');
//                 setRecipes([]);
//                 setSelectedRecipe(null);
//                 setRecipeDetails({});
//               }}
//               className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition-colors"
//             >
//               Clear Filter
//             </button>
//           </div>
//         </div>

//         {/* Right Column - Generated Recipes */}
//         <div className="space-y-6">
//           <h2 className="text-4xl font-bold text-white mb-8">🥕 Generated Recipes:</h2>
          
//           {isLoading ? (
//             <div className="flex justify-center items-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//               <p className="text-white ml-4">Loading...</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {recipes.map((recipe, index) => (
//                 <div key={index} className="bg-white p-6 rounded-lg shadow-md">
//                   <button 
//                     onClick={() => getRecipeDetails(recipe, index)}
//                     className="text-xl font-semibold text-green-600 text-left w-full hover:text-green-700"
//                   >
//                     Recipe {index + 1}: {recipe}
//                   </button>
                  
//                   {selectedRecipe === index && (
//                     <div className="mt-4">
//                       {loadingDetails ? (
//                         <div className="flex items-center">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
//                           <p className="text-green-600 ml-2">Loading details...</p>
//                         </div>
//                       ) : (
//                         recipeDetails[index] && (
//                           <ReactMarkdown className="mt-4 border-t pt-4 whitespace-pre-line">
//                             {recipeDetails[index]}
//                           </ReactMarkdown>
//                         )
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }