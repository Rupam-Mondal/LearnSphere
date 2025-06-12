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
    <ComplexNavbar className="bg-white dark:bg-black">
      {/* Desktop Navbar */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={menuItems} />
        <button className="hidden lg:block px-4 py-2 bg-blue-600 text-white rounded-md">
          Sign In
        </button>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav visible={false}>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          {menuItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              onClick={() => setMobileOpen(false)}
              className="block w-full py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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
