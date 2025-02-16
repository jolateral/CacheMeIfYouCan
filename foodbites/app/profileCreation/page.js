// 'use client';
// import { useState } from 'react';
// import { db, auth } from '@/lib/firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { Camera } from 'lucide-react';

// const ProfileCreationPage = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     gender: '',
//     birthday: '',
//     allergies: '',
//     dietaryRestrictions: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!auth.currentUser) {
//       console.error('No user logged in');
//       return;
//     }

//     try {
//       const birthDate = new Date(formData.birthday);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }

//       const profileData = {
//         userId: auth.currentUser.uid,
//         name: `${formData.firstName} ${formData.lastName}`,
//         age: age,
//         gender: formData.gender,
//         allergies: formData.allergies || 'None',
//         dietaryRestriction: formData.dietaryRestrictions || 'N/A',
//         createdAt: new Date().toISOString()
//       };

//       await addDoc(collection(db, 'profiles'), profileData);

//       setFormData({
//         firstName: '',
//         lastName: '',
//         gender: '',
//         birthday: '',
//         allergies: '',
//         dietaryRestrictions: ''
//       });

// //     //   window.location.href = '/profiles';

//     await addDoc(collection(db, 'profiles'), profileData);
// setTimeout(() => {
//   window.location.href = '/profiles';
// }, 500); // Small delay to allow Firestore to update



//     } catch (error) {
//       console.error('Error saving profile:', error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#8CF15D]">
//       <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-lg">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex justify-center mb-6">
//             <div className="relative w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
//               <Camera className="w-10 h-10 text-blue-400" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               required
//             >
//               <option value="">Select gender...</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Birthday</label>
//             <input
//               type="date"
//               name="birthday"
//               value={formData.birthday}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Allergies</label>
//             <input
//               type="text"
//               name="allergies"
//               value={formData.allergies}
//               onChange={handleChange}
//               placeholder="Type here..."
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
//             <input
//               type="text"
//               name="dietaryRestrictions"
//               value={formData.dietaryRestrictions}
//               onChange={handleChange}
//               placeholder="Type here..."
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProfileCreationPage;


'use client';
import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Camera } from 'lucide-react';

const ProfileCreationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthday: '',
    allergies: '',
    dietaryRestrictions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      console.error('No user logged in');
      return;
    }

    try {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const profileData = {
        userId: auth.currentUser.uid,
        name: `${formData.firstName} ${formData.lastName}`,
        age: age,
        gender: formData.gender,
        allergies: formData.allergies || 'None',
        dietaryRestriction: formData.dietaryRestrictions || 'N/A',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'profiles'), profileData);

      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        allergies: '',
        dietaryRestrictions: ''
      });

      setTimeout(() => {
        window.location.href = '/profiles';
      }, 500); // Small delay to allow Firestore to update

    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#8CF15D]">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Type here..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
            <input
              type="text"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              placeholder="Type here..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationPage;