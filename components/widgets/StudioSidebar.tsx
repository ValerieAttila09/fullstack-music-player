'use client';

import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-neutral-900 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">My Studio</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors ${ 
                    isActive 
                      ? "bg-neutral-800 text-white"
                      : "hover:bg-neutral-700"
                  }`}>
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
