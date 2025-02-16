// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';

// // Profile Card Component
// const ProfileCard = ({ profile, isCurrentUser }) => {
//   return (
//     <div className="bg-white rounded-lg p-6 shadow-md">
//       <div className="flex items-center gap-4 mb-4">
//         <div className="relative w-12 h-12">
//           <Image
//             src="/profile-photo.png"
//             alt="Profile"
//             fill
//             className="rounded-full object-cover"
//           />
//         </div>
//         <div>
//           <h3 className="font-semibold">
//             {profile.name} {isCurrentUser && "(ME)"}
//           </h3>
//           <p className="text-sm text-gray-600">
//             Age: {profile.age} | Gender: {profile.gender}
//           </p>
//         </div>
//       </div>

//       <div className="space-y-2 mb-4">
//         <p className="text-sm">
//           <span className="font-medium">Allergies:</span> {profile.allergies}
//         </p>
//         <p className="text-sm">
//           <span className="font-medium">Dietary Restriction:</span> {profile.dietaryRestriction}
//         </p>
//       </div>

//       <div className="flex justify-end">
//         {isCurrentUser ? (
//           <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors">
//             Edit
//           </button>
//         ) : (
//           <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors">
//             Edit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Add Profile Card Component
// const AddProfileCard = () => {
//   return (
//     <Link href="/profileCreation">
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors h-[200px]">
//         <Image
//           src="/add-profile-icon.png"
//           alt="Add Profile"
//           width={50}
//           height={50}
//         />
//       </div>
//     </Link>
//   );
// };

// // Main Profiles Page Component
// export default function ProfilesPage() {
//   // Mock data - replace with actual data from your backend
//   const profiles = [
//     {
//       name: "TestUser",
//       age: 23,
//       gender: "Female",
//       allergies: "Peanuts, Sesame",
//       dietaryRestriction: "N/A",
//     },
//     {
//       name: "TestUser 1",
//       age: 20,
//       gender: "Male",
//       allergies: "Shrimp",
//       dietaryRestriction: "Vegan, Vegetarian",
//     },
//     {
//       name: "TestUser 2",
//       age: 23,
//       gender: "Other",
//       allergies: "Nuts, Gluten, Dairy",
//       dietaryRestriction: "Lactose intolerant",
//     },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-8 bg-[#8CF15D]"> {/* Background color added here */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {profiles.map((profile, index) => (
//           <ProfileCard
//             key={index}
//             profile={profile}
//             isCurrentUser={index === 0}
//           />
//         ))}
//         <AddProfileCard />
//       </div>
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Camera } from 'lucide-react';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'profiles'),
      where('userId', '==', auth.currentUser.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      const profilesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen" style={{ backgroundColor: "#80c852eb" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {profile.name} {profile.isCurrentUser ? "(ME)" : ""}
                </h3>
                <p className="text-sm text-gray-600">
                  Age: {profile.age} | Gender: {profile.gender}
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="font-medium">Allergies:</span> {profile.allergies}
              </p>
              <p className="text-sm">
                <span className="font-medium">Dietary Restriction:</span>{" "}
                {profile.dietaryRestriction}
              </p>
            </div>
            <div className="flex justify-end">
            <button
              style={{
                backgroundColor: "#16A34A", // Custom green color
                color: "white",
                padding: "4px 16px", // px-4 py-1
                borderRadius: "4px", // rounded
                transition: "background-color 0.3s ease",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803D")} // Hover effect (#green-700 equivalent)
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#16A34A")}
            >
              Edit
            </button>
            </div>
          </div>
        ))}
        
        {/* Add Profile Card */}
        <div 
          onClick={() => window.location.href = '/profileCreation'}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors h-[200px]"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProfilesPage;