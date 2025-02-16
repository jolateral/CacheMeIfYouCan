// 'use client';
// import { useState, useEffect } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import ReactMarkdown from 'react-markdown';
// import { Heart } from 'lucide-react';
// import { db, auth } from '@/lib/firebase';
// import { doc, setDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// export default function RecipePage() {
//   const [selectedMeal, setSelectedMeal] = useState('');
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [profiles, setProfiles] = useState([]);
//   const [ingredients, setIngredients] = useState('');
//   const [recipes, setRecipes] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [recipeDetails, setRecipeDetails] = useState({});
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [savedRecipes, setSavedRecipes] = useState({});

//   const meals = ['Breakfast', 'Lunch', 'Dinner'];

//   // Fetch profiles when component mounts
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       if (!auth.currentUser) {
//         console.log('No user logged in');
//         return;
//       }

//       try {
//         const q = query(
//           collection(db, 'profiles'),
//           where('userId', '==', auth.currentUser.uid)
//         );
//         const querySnapshot = await getDocs(q);
//         const fetchedProfiles = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProfiles(fetchedProfiles);
//         console.log('Fetched profiles:', fetchedProfiles);
//       } catch (error) {
//         console.error('Error fetching profiles:', error);
//       }
//     };

//     fetchProfiles();
//   }, []);

//   const generateRecipes = async () => {
//     if (!selectedMeal || !selectedProfile || !ingredients) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     setRecipes([]);
//     setSelectedRecipe(null);
//     setRecipeDetails({});
    
//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
//       const dietaryRestrictions = selectedProfile.dietaryRestriction !== 'N/A' 
//         ? `and follows these dietary restrictions: ${selectedProfile.dietaryRestriction}` 
//         : '';
      
//       const allergies = selectedProfile.allergies !== 'None'
//         ? `and has allergies to: ${selectedProfile.allergies}` 
//         : '';

//       const prompt = `Generate 2 healthy ${selectedMeal.toLowerCase()} recipes using these ingredients: ${ingredients}. 
//         The recipes are for ${selectedProfile.name} who is ${selectedProfile.age} years old ${dietaryRestrictions} ${allergies}.
//         Ensure the recipes strictly avoid any allergens mentioned and comply with dietary restrictions.
//         Format each recipe with just a title. Keep each recipe title under 50 characters.`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();
      
//       const recipesList = text.split('\n').filter(line => line.trim().length > 0);
//       setRecipes(recipesList.slice(0, 2));
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
      
//       const dietaryRestrictions = selectedProfile.dietaryRestriction !== 'N/A'
//         ? `Consider these dietary restrictions: ${selectedProfile.dietaryRestriction}.`
//         : '';
      
//       const allergies = selectedProfile.allergies !== 'None'
//         ? `Ensure the recipe avoids these allergens: ${selectedProfile.allergies}.`
//         : '';

//       const prompt = `Create a detailed recipe for "${recipe}" that's ${selectedMeal.toLowerCase()} appropriate.
//         ${dietaryRestrictions}
//         ${allergies}
//         Include:
//         1. Preparation time
//         2. Cooking time
//         3. Total time
//         4. Servings
//         5. Ingredients with quantities
//         6. Step-by-step instructions
//         7. Nutritional information (calories, protein, carbs, fats)
//         8. Tags (e.g., "High protein", "Low carb", etc.)
//         9. Allergen warnings if applicable`;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();
      
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

//   const saveRecipe = async (recipe, index) => {
//     if (!auth.currentUser) {
//       alert('Please sign in to save recipes');
//       return;
//     }

//     try {
//       const details = recipeDetails[index] || '';
//       const timeMatch = details.match(/Total time: (\d+)/i);
//       const proteinMatch = details.match(/Protein: (\d+)g/i);
//       const caloriesMatch = details.match(/Calories: (\d+)/i);

//       const recipeData = {
//         title: recipe,
//         details: details,
//         savedAt: serverTimestamp(),
//         userId: auth.currentUser.uid,
//         profileId: selectedProfile.id,
//         profileName: selectedProfile.name,
//         meal: selectedMeal,
//         ingredients: ingredients,
//         nutritionalInfo: {
//           protein: proteinMatch ? 'High protein' : 'Balanced protein',
//           time: timeMatch ? `${timeMatch[1]} min` : '30 min',
//           feature: caloriesMatch && caloriesMatch[1] < 500 ? 'Low calorie' : 'Nutrient rich'
//         }
//       };

//       const recipeRef = doc(collection(db, 'savedRecipes'));
//       await setDoc(recipeRef, recipeData);

//       setSavedRecipes(prev => ({
//         ...prev,
//         [index]: true
//       }));

//       alert('Recipe saved successfully!');
//     } catch (error) {
//       console.error('Error saving recipe:', error);
//       alert('Failed to save recipe. Please try again.');
//     }
//   };

//   return (
//     <div
//       className="min-h-screen p-8"
//       style={{
//         background: "linear-gradient(to bottom right, #80c852eb, #77cb42)"
//       }}
//     >
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column - Filters */}
//         <div className="space-y-8">
//           <h2 className="text-4xl font-bold text-white mb-8">Filters</h2>
          
//           {/* Meal Selection */}
//           <div className="flex gap-4 flex-wrap">
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

//           {/* Profile Selection */}
//           <div>
//             <h3 className="text-white text-xl mb-4">Who are you cooking for?</h3>
//             <div className="flex gap-4 flex-wrap">
//               {profiles.map((profile) => (
//                 <button
//                   key={profile.id}
//                   onClick={() => setSelectedProfile(profile)}
//                   className={`py-2 px-6 rounded-full transition-colors ${
//                     selectedProfile?.id === profile.id
//                       ? 'bg-white text-green-600' 
//                       : 'bg-green-600 text-white hover:bg-green-700'
//                   }`}
//                 >
//                   {profile.name}
//                 </button>
//               ))}
//             </div>
//             {selectedProfile && (
//               <div className="mt-4 bg-white/80 p-4 rounded-lg">
//                 <p className="text-green-700">
//                   <strong>Age:</strong> {selectedProfile.age}
//                 </p>
//                 {selectedProfile.allergies !== 'None' && (
//                   <p className="text-green-700">
//                     <strong>Allergies:</strong> {selectedProfile.allergies}
//                   </p>
//                 )}
//                 {selectedProfile.dietaryRestriction !== 'N/A' && (
//                   <p className="text-green-700">
//                     <strong>Dietary Restrictions:</strong> {selectedProfile.dietaryRestriction}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Ingredients Input */}
//           <div>
//             <h3 className="text-white text-xl mb-4">What's in your fridge?</h3>
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
//               disabled={!selectedMeal || !selectedProfile || !ingredients}
//             >
//               Generate Recipes
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedMeal('');
//                 setSelectedProfile(null);
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
//           <h2 className="text-4xl font-bold text-white mb-8">✨ Generated Recipes</h2>
          
//           {isLoading ? (
//             <div className="flex justify-center items-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//               <p className="text-white ml-4">Loading...</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {recipes.map((recipe, index) => (
//                 <div key={index} className="bg-white p-6 rounded-lg shadow-md">
//                   <div className="flex justify-between items-center">
//                     <button 
//                       onClick={() => getRecipeDetails(recipe, index)}
//                       className="text-xl font-semibold text-green-600 text-left hover:text-green-700"
//                     >
//                       {recipe}
//                     </button>
//                     <button
//                       onClick={() => saveRecipe(recipe, index)}
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                       <Heart
//                         className={`h-6 w-6 ${
//                           savedRecipes[index] ? 'fill-red-500 text-red-500' : 'text-gray-400'
//                         }`}
//                       />
//                     </button>
//                   </div>
                  
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

'use client';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Heart } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function RecipePage() {
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState({});

  const meals = ['Breakfast', 'Lunch', 'Dinner'];

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!auth.currentUser) {
        console.log('No user logged in');
        return;
      }

      try {
        const q = query(
          collection(db, 'profiles'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedProfiles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(fetchedProfiles);
        console.log('Fetched profiles:', fetchedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const generateRecipes = async () => {
    if (!selectedMeal || !selectedProfile || !ingredients) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setRecipes([]);
    setSelectedRecipe(null);
    setRecipeDetails({});
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const dietaryRestrictions = selectedProfile.dietaryRestriction !== 'N/A' 
        ? `and follows these dietary restrictions: ${selectedProfile.dietaryRestriction}` 
        : '';
      
      const allergies = selectedProfile.allergies !== 'None'
        ? `and has allergies to: ${selectedProfile.allergies}` 
        : '';

      const prompt = `Create 2 unique recipe titles for ${selectedMeal.toLowerCase()} dishes using these ingredients: ${ingredients}. 
        The recipes are for ${selectedProfile.name} who is ${selectedProfile.age} years old ${dietaryRestrictions} ${allergies}.
        Requirements:
        - Each recipe must be an actual dish title, not an ingredients list
        - Keep titles under 50 characters
        - Make titles descriptive and appetizing
        - Ensure recipes avoid any mentioned allergens
        - Comply with dietary restrictions
        - Format the output as two lines, with one recipe title per line
        - Do not include numbers, asterisks, or other formatting
        - Do not include the word "Recipe" or "Ingredients" in the titles`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const recipesList = text
        .split('\n')
        .filter(line => 
          line.trim().length > 0 && 
          !line.toLowerCase().includes('ingredients:') &&
          !line.toLowerCase().includes('recipe:')
        )
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 2);

      setRecipes(recipesList);
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
      
      const dietaryRestrictions = selectedProfile.dietaryRestriction !== 'N/A'
        ? `Consider these dietary restrictions: ${selectedProfile.dietaryRestriction}.`
        : '';
      
      const allergies = selectedProfile.allergies !== 'None'
        ? `Ensure the recipe avoids these allergens: ${selectedProfile.allergies}.`
        : '';

      const prompt = `Create a detailed recipe for "${recipe}" that's ${selectedMeal.toLowerCase()} appropriate.
        ${dietaryRestrictions}
        ${allergies}
        Include:
        1. Preparation time
        2. Cooking time
        3. Total time
        4. Servings
        5. Ingredients with quantities
        6. Step-by-step instructions
        7. Nutritional information (calories, protein, carbs, fats)
        8. Tags (e.g., "High protein", "Low carb", etc.)
        9. Allergen warnings if applicable`;

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
      const details = recipeDetails[index] || '';
      const timeMatch = details.match(/Total time: (\d+)/i);
      const proteinMatch = details.match(/Protein: (\d+)g/i);
      const caloriesMatch = details.match(/Calories: (\d+)/i);

      const recipeData = {
        title: recipe,
        details: details,
        savedAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        profileId: selectedProfile.id,
        profileName: selectedProfile.name,
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
    <div
      className="min-h-screen p-8"
      style={{
        background: "linear-gradient(to bottom right, #80c852eb, #77cb42)"
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Filters */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white mb-8">Filters</h2>
          
          {/* Meal Selection */}
          <div className="flex gap-4 flex-wrap">
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

          {/* Profile Selection */}
          <div>
            <h3 className="text-white text-xl mb-4">Who are you cooking for?</h3>
            <div className="flex gap-4 flex-wrap">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`py-2 px-6 rounded-full transition-colors ${
                    selectedProfile?.id === profile.id
                      ? 'bg-white text-green-600' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {profile.name}
                </button>
              ))}
            </div>
            {selectedProfile && (
              <div className="mt-4 bg-white/80 p-4 rounded-lg">
                <p className="text-green-700">
                  <strong>Age:</strong> {selectedProfile.age}
                </p>
                {selectedProfile.allergies !== 'None' && (
                  <p className="text-green-700">
                    <strong>Allergies:</strong> {selectedProfile.allergies}
                  </p>
                )}
                {selectedProfile.dietaryRestriction !== 'N/A' && (
                  <p className="text-green-700">
                    <strong>Dietary Restrictions:</strong> {selectedProfile.dietaryRestriction}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Ingredients Input */}
          <div>
            <h3 className="text-white text-xl mb-4">What's in your fridge?</h3>
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
              disabled={!selectedMeal || !selectedProfile || !ingredients}
            >
              Generate Recipes
            </button>
            <button
              onClick={() => {
                setSelectedMeal('');
                setSelectedProfile(null);
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
          <h2 className="text-4xl font-bold text-white mb-8">✨ Generated Recipes</h2>
          
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