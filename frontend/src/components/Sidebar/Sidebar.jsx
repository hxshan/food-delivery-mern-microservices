import React from 'react';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-[18%] min-h-screen border-[1.5px] border-gray-400 border-t-0 text-[max(1vw,10px)]">
      <div className="pt-12 pl-[20%] flex flex-col gap-5">
        <NavLink 
          to='/add-restaurant' 
          className={({isActive}) => 
            `flex items-center gap-3 border border-r-0 border-gray-400 p-2 rounded-tl rounded-bl cursor-pointer
            ${isActive ? "bg-[#fff0ed] border-[#FA5F55]" : ""}`
          }
        >
          <img src={assets.add_icon} alt="" />
          <p className="md:block hidden">Add Restaurant</p>
        </NavLink>
        
        <NavLink 
          to='/' 
          className={({isActive}) => 
            `flex items-center gap-3 border border-r-0 border-gray-400 p-2 rounded-tl rounded-bl cursor-pointer
            ${isActive ? "bg-[#fff0ed] border-[#FA5F55]" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p className="md:block hidden">Restaurant Details</p>
        </NavLink>
        
        <NavLink 
          to='/add-menu' 
          className={({isActive}) => 
            `flex items-center gap-3 border border-r-0 border-gray-400 p-2 rounded-tl rounded-bl cursor-pointer
            ${isActive ? "bg-[#fff0ed] border-[#FA5F55]" : ""}`
          }
        >
          <img src={assets.add_icon} alt="" />
          <p className="md:block hidden">Add Menu</p>
        </NavLink>

        <NavLink 
          to='/' 
          className={({isActive}) => 
            `flex items-center gap-3 border border-r-0 border-gray-400 p-2 rounded-tl rounded-bl cursor-pointer
            ${isActive ? "bg-[#fff0ed] border-[#FA5F55]" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p className="md:block hidden">Menu List</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;