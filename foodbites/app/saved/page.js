'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import RecipeCard from '@/components/Recipe/RecipeCard';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    const fetchRecipes = async () => {
      try {
        const q = query(
          collection(db, 'recipes'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const recipesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRecipes(recipesList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoadingRecipes(false);
      }
    };
    
    fetchRecipes();
  }, [user, loading, router]);

  if (loading || loadingRecipes) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Saved Recipes</h1>
      
      {recipes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg mb-4">You haven't saved any recipes yet.</p>
          <button
            onClick={() => router.push('/recipes')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate Your First Recipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}