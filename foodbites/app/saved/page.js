'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

export default function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    //<div className="min-h-screen bg-gradient-to-br from-green-400 to-green-500 p-8">
      <div
        className="min-h-screen p-8"
        style={{
          background: "linear-gradient(to bottom right, #80c852eb, #77cb42)"
        }}
      >

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center">
          <span className="mr-3">🔖</span> Your Saved Recipes
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-lg mb-4 text-gray-700">You haven't saved any recipes yet.</p>
            <button
              onClick={() => router.push('/recipes')}
              // className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
              style={{
                backgroundColor: "#16A34A", // Equivalent to bg-green-500
                color: "white",
                padding: "12px 24px", // px-6 py-3
                borderRadius: "6px", // rounded-md
                fontWeight: "500", // font-medium
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2f855a")} // Hover effect (bg-green-600)
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#16A34A")}
            >
              Generate Your First Recipe
            </button>
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

