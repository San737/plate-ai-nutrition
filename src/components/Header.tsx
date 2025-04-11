
import React from 'react';
import { Utensils } from 'lucide-react';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Utensils className="h-6 w-6 text-emerald-500 mr-2" />
          <h1 className="text-xl font-bold">Food Track</h1>
        </div>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
