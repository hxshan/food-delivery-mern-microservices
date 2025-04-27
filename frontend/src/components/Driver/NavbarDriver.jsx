import React from 'react';

const NavbarDriver = ({page}) => {
  return (
    <nav className="bg-[#EB4C40] p-4 text-white flex justify-between">
      <span className="font-bold">{page}</span>
      <span>Online</span>
    </nav>
  );
};

export default NavbarDriver;
