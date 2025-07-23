
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600`}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-around">
        <NavLink href="/home">Home</NavLink>
        <NavLink href="/data">Data</NavLink>
        <NavLink href="/profile">Profile</NavLink>
        <NavLink href="/login">Login</NavLink>
        <NavLink href="/settings">Settings</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
