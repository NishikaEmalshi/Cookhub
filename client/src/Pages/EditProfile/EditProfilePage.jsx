import React from 'react';
import EditProfileForm from '../../Components/EditProfileComponent/EditProfileForm';

const EditProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="max-w-4xl px-4 py-12 mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Edit Your Profile
          </h1>
          <p className="text-gray-600">
            Customize your profile to make it uniquely yours
          </p>
        </div>

        {/* Card Container */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
          {/* Decorative Header */}
          <div className="relative h-20 bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="absolute transform -translate-x-1/2 -bottom-10 left-1/2">
              <div className="flex items-center justify-center w-20 h-20 bg-white border-4 border-white rounded-full shadow-md">
                <svg 
                  className="w-10 h-10 text-gray-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="px-6 pt-16 pb-8">
            <EditProfileForm />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-center text-gray-500">
              Your information is securely saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;