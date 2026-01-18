import { Button } from '@/components/ui/button';
import { landingPageNavMenu } from '@/lib/constants';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between">
      <div className="">
        <Button variant={'ghost'} className='relative flex justify-center items-center overflow-hidden w-14'>
          <span className="flex flex-col space-y-1">
            <span className="w-8 h-px bg-black" />
            <span className="w-7 h-px bg-black" />
            <span className="w-6 h-px bg-black" />
          </span>
        </Button>
      </div>
      <div className="flex items-center gap-6">
        {landingPageNavMenu.map((data) => {
          return (
            <Link key={data.label} href={data.href} className="flex items-center gap-1 justify-center font-normal min-w-12 max-w-20 relative">
              <div className="w-[5px] h-[4px] bg-black"></div>
              <p className="text-xs">{data.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="">
        <Link href={"/sign-in"} className='font-regular text-sm px-4'>
          <span className="">SIGN IN</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;