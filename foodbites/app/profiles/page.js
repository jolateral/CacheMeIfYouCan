'use client';
import Image from 'next/image';
import Link from 'next/link';

// Profile Card Component
const ProfileCard = ({ profile, isCurrentUser }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12">
          <Image
            src="/profile-photo.png"
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">
            {profile.name} {isCurrentUser && "(ME)"}
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
          <span className="font-medium">Dietary Restriction:</span> {profile.dietaryRestriction}
        </p>
      </div>

      <div className="flex justify-end">
        {isCurrentUser ? (
          <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors">
            Edit
          </button>
        ) : (
          <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

// Add Profile Card Component
const AddProfileCard = () => {
  return (
    <Link href="/profiles/new">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors h-[200px]">
        <Image
          src="/add-profile-icon.png"
          alt="Add Profile"
          width={50}
          height={50}
        />
      </div>
    </Link>
  );
};

// Main Profiles Page Component
export default function ProfilesPage() {
  // Mock data - replace with actual data from your backend
  const profiles = [
    {
      name: "TestUser",
      age: 23,
      gender: "Female",
      allergies: "Peanuts, Sesame",
      dietaryRestriction: "N/A",
    },
    {
      name: "TestUser 1",
      age: 20,
      gender: "Male",
      allergies: "Shrimp",
      dietaryRestriction: "Vegan, Vegetarian",
    },
    {
      name: "TestUser 2",
      age: 23,
      gender: "Other",
      allergies: "Nuts, Gluten, Dairy",
      dietaryRestriction: "Lactose intolerant",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#8CF15D]"> {/* Background color added here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile, index) => (
          <ProfileCard
            key={index}
            profile={profile}
            isCurrentUser={index === 0}
          />
        ))}
        <AddProfileCard />
      </div>
    </div>
  );
}
