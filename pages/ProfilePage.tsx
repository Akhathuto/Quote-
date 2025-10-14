
import React from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="mt-2 text-gray-400">Manage your personal and company information.</p>
      </div>

      <div className="bg-brand-secondary p-8 rounded-lg border border-gray-700 shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center space-x-6 mb-8">
          <img src="https://picsum.photos/100" alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-gray-600" />
          <div>
            <h2 className="text-2xl font-bold text-white">John Doe</h2>
            <p className="text-gray-400">Lead Procurement Officer</p>
            <button className="mt-2 text-sm text-brand-primary hover:underline">Change Photo</button>
          </div>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input type="text" defaultValue="John Doe" className="pl-10 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm sm:text-sm text-white"/>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input type="email" defaultValue="john.doe@edgtec.co.za" className="pl-10 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm sm:text-sm text-white"/>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <input type="tel" defaultValue="+27 82 123 4567" className="pl-10 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm sm:text-sm text-white"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Company</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Building className="h-5 w-5 text-gray-500" />
              </div>
              <input type="text" defaultValue="Edgtec Pty Ltd" readOnly className="pl-10 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-400 cursor-not-allowed"/>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
