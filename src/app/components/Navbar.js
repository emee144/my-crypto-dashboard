"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  TrendingUp,
  Menu,
} from "lucide-react";

export default function Navbar({ isLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const cardStyle =
    "flex items-center space-x-2 bg-white text-blue-900 font-semibold px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all";

  const menuItems = [
    {
      href: isLoggedIn ? "/dashboard" : "/",
      label: isLoggedIn ? "Dashboard" : "Home",
      icon: <LayoutDashboard size={18} />,
    },
    { href: "/assets", label: "Assets", icon: <Wallet size={18} /> },
    { href: "/transactions", label: "Transactions", icon: <Receipt size={18} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
    {
      href: "/trade",
      label: "Trade",
      icon: <TrendingUp size={18} />,
    },
  ];

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold flex items-center">
          <span>NEXTRADE</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex space-x-4">
          {menuItems.map(({ href, label, icon }) => (
            <li key={label}>
              <Link href={href} className={cardStyle}>
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger Button */}
        <button
          className="sm:hidden flex items-center justify-center p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="sm:hidden mt-4 flex gap-3 px-4 overflow-x-auto pb-2">
          {menuItems.map(({ href, label, icon }) => (
            <li key={label} className="flex-shrink-0">
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cardStyle}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
