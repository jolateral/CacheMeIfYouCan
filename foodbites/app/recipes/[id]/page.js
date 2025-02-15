'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function RecipeDetail({ params }) {
  const { id } = params;
  const { user, loading } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoadingRecipe(false);
      }
    };
    
    fetchRecipe();
  }, [id, user, loading, router]);

  if (loading || loadingRecipe) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!recipe) {
    return <div className="text-center p-8">Recipe not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">{recipe.title}</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
      </div>
      
      {recipe.nutritionInfo && (
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Nutrition Information</h2>
          <p className="text-gray-700">{recipe.nutritionInfo}</p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}