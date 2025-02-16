'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

export default function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, 'savedRecipes'),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      
      setSavedRecipes(recipes);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsaveRecipe = async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'savedRecipes', recipeId));
      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error removing recipe:', error);
      alert('Failed to remove recipe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center">
          <span className="mr-3">🔖</span> Your Saved Recipes
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {recipe.title}
                    </h3>
                    <button
                      onClick={() => unsaveRecipe(recipe.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Remove from saved"
                    >
                      <Heart className={`h-6 w-6 ${
                        true ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`} />
                    </button>
                  </div>
                  
                  {recipe.nutritionalInfo && (
                    <div className="flex gap-2 mt-2 text-gray-600">
                      <span className="font-medium">{recipe.nutritionalInfo.protein}</span>
                      <span className="px-1">|</span>
                      <span className="font-medium">{recipe.nutritionalInfo.time}</span>
                      <span className="px-1">|</span>
                      <span className="font-medium">{recipe.nutritionalInfo.feature}</span>
                    </div>
                  )}

                  {selectedRecipe === recipe.id && (
                    <div className="mt-4 border-t pt-4">
                      <ReactMarkdown className="prose max-w-none">
                        {recipe.details}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// // SavedRecipesPage.js
// 'use client';
// import { useState, useEffect } from 'react';
// import { Heart } from 'lucide-react';
// import { db, auth } from '../firebase-config';
// import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import ReactMarkdown from 'react-markdown';

// export default function SavedRecipesPage() {
//   const [savedRecipes, setSavedRecipes] = useState([]);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchSavedRecipes();
//   }, []);

//   const fetchSavedRecipes = async () => {
//     if (!auth.currentUser) return;

//     try {
//       const q = query(
//         collection(db, 'savedRecipes'),
//         where('userId', '==', auth.currentUser.uid)
//       );
      
//       const querySnapshot = await getDocs(q);
//       const recipes = [];
//       querySnapshot.forEach((doc) => {
//         recipes.push({ id: doc.id, ...doc.data() });
//       });
      
//       setSavedRecipes(recipes);
//     } catch (error) {
//       console.error('Error fetching saved recipes:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const unsaveRecipe = async (recipeId) => {
//     try {
//       await deleteDoc(doc(db, 'savedRecipes', recipeId));
//       setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
//       alert('Recipe removed from saved recipes');
//     } catch (error) {
//       console.error('Error removing recipe:', error);
//       alert('Failed to remove recipe. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-500 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-white mb-8">
//           <span className="mr-2">📌</span> Your Saved Recipes
//         </h1>

//         {isLoading ? (
//           <div className="flex justify-center items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {savedRecipes.map((recipe) => (
//               <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="p-6">
//                   <div className="flex justify-between items-center">
//                     <button
//                       onClick={() => setSelectedRecipe(selectedRecipe === recipe.id ? null : recipe.id)}
//                       className="text-xl font-semibold text-green-600 hover:text-green-700"
//                     >
//                       {recipe.title}
//                     </button>
//                     <button
//                       onClick={() => unsaveRecipe(recipe.id)}
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                       <Heart className="h-6 w-6 fill-red-500 text-red-500" />
//                     </button>
//                   </div>
                  
//                   <div className="flex gap-4 mt-2 text-sm text-gray-600">
//                     {recipe.nutritionalInfo && (
//                       <>
//                         <span>{recipe.nutritionalInfo.protein}</span>
//                         <span>|</span>
//                         <span>{recipe.nutritionalInfo.time}</span>
//                         <span>|</span>
//                         <span>{recipe.nutritionalInfo.feature}</span>
//                       </>
//                     )}
//                   </div>

//                   {selectedRecipe === recipe.id && (
//                     <div className="mt-4 border-t pt-4">
//                       <ReactMarkdown className="whitespace-pre-line">
//                         {recipe.details}
//                       </ReactMarkdown>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { useAuth } from '@/context/AuthContext';
// // import { collection, query, where, getDocs } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';
// // import RecipeCard from '@/components/Recipe/RecipeCard';
// // import { useRouter } from 'next/navigation';

// // export default function Dashboard() {
// //   const { user, loading } = useAuth();
// //   const [recipes, setRecipes] = useState([]);
// //   const [loadingRecipes, setLoadingRecipes] = useState(true);
// //   const router = useRouter();

// //   useEffect(() => {
// //     if (loading) return;
    
// //     if (!user) {
// //       router.push('/auth/signin');
// //       return;
// //     }
    
// //     const fetchRecipes = async () => {
// //       try {
// //         const q = query(
// //           collection(db, 'recipes'),
// //           where('userId', '==', user.uid)
// //         );
        
// //         const querySnapshot = await getDocs(q);
// //         const recipesList = querySnapshot.docs.map(doc => ({
// //           id: doc.id,
// //           ...doc.data()
// //         }));
        
// //         setRecipes(recipesList);
// //       } catch (error) {
// //         console.error('Error fetching recipes:', error);
// //       } finally {
// //         setLoadingRecipes(false);
// //       }
// //     };
    
// //     fetchRecipes();
// //   }, [user, loading, router]);

// //   if (loading || loadingRecipes) {
// //     return <div className="text-center p-8">Loading...</div>;
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h1 className="text-3xl font-bold mb-6">Your Saved Recipes</h1>
      
// //       {recipes.length === 0 ? (
// //         <div className="bg-white p-6 rounded-lg shadow-md text-center">
// //           <p className="text-lg mb-4">You haven't saved any recipes yet.</p>
// //           <button
// //             onClick={() => router.push('/recipes')}
// //             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
// //           >
// //             Generate Your First Recipe
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {recipes.map(recipe => (
// //             <RecipeCard key={recipe.id} recipe={recipe} />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }