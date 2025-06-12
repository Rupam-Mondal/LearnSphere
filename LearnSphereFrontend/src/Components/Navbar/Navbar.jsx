import React, { useState } from "react";
import {
  Navbar as ComplexNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "./Resizable_Navbar";

const menuItems = [
  { name: "Home", link: "#" },
  { name: "About", link: "#about" },
  { name: "Services", link: "#services" },
  { name: "Contact", link: "#contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ComplexNavbar>
      {/* Desktop Navbar */}
      <NavBody className="bg-white shadow-md">
        <NavbarLogo />
        <NavItems items={menuItems} />
        <div className="hidden lg:flex space-x-4">
          <button className="px-5 cursor-pointer py-2 bg-[#7F00FF] text-white rounded-md text-base font-semibold cursor-pointer hover:bg-indigo-700 transition">
            Sign In
          </button>
          <button className="px-5 cursor-pointer py-2 bg-gray-100 text-gray-800 rounded-md text-base font-semibold cursor-pointer hover:bg-gray-200 transition border border-gray-300">
            Login
          </button>
        </div>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav visible={false} className="bg-white shadow-md">
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          className="bg-white"
        >
          {menuItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              onClick={() => setMobileOpen(false)}
              className="block w-full py-2 px-4 rounded hover:bg-gray-200"
            >
              {item.name}
            </a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </ComplexNavbar>
  );
}

export default Navbar;
