import React from 'react';
import { assets } from '../../assets/assets';

function Navbar() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-2 px-4 md:px-[4%]">
        <img 
          className="w-[80px] max-w-[10%]" 
        
          alt="Logo" 
        />
        <img 
          className="w-10 h-10 rounded-full object-cover" 
          src={assets.profile_image} 
          alt="Profile" 
        />
      </div>
    </div>
  );
}

export default Navbar;