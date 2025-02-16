'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {/* <div style={{textAlign: 'center', color: '#6DBA36', fontSize: 36, fontFamily: 'Baloo Paaji', fontWeight: '400', letterSpacing: 0.72, wordWrap: 'break-word'}}>
            LifeBites
          </div> */}
          <Image 
            src="/lifebites-logo.png" 
            alt="LifeBites Logo" 
            width={120} 
            height={40} 
            className="object-contain"

        
          />
        </Link>
        
        <div className="space-x-6">
          <Link href="/" className="hover:text-green-500">Home</Link>
          <Link href="/recipes" className="hover:text-green-500">Recipes</Link>
          <Link href="/profiles" className="hover:text-green-500">Profiles</Link>
          {user ? (
            <>
              <Link href="/saved" className="hover:text-green-500">
                Saved
              </Link>
              <button
                onClick={logout}
                className="hover:text-green-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              href="/get-app" 
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
            >
              Get the app
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}