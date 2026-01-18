import React from 'react';
import Navbar from '../Navbar/Navbar';

const Window = () => {
  return (
    <div className="fixed inset-5 bg-transparent border rounded-lg overflow-hidden">
      <div className="w-full relative h-full">
        <div className="absolute z-5 top-0 inset-x-0 w-full border-b">
          <Navbar/>
        </div>
        <div className="absolute z-4 left-0 inset-y-0 h-full w-[57px] border-r flex items-end justify-center">
          <div className="relative w-full h-full"></div>
          <div className="absolute py-2 z-6 bottom-0 flex flex-col justify-center items-center left-0 min-w-14 space-y-0.5">
            <div className="w-2 h-px bg-black"/>
            <div className="w-5 h-px bg-black"/>
            <div className="w-3 h-px bg-black"/>
            <div className="w-2 h-px bg-black"/>
            <div className="w-4 h-px bg-black"/>
            <div className="w-6 h-px bg-black"/>
            <div className="w-7 h-px bg-black"/>
            <div className="w-8 h-px bg-black"/>
            <div className="w-5 h-px bg-black"/>
            <div className="w-7 h-px bg-black"/>
            <div className="w-6 h-px bg-black"/>
            <div className="w-5 h-px bg-black"/>
            <div className="w-7 h-px bg-black"/>
            <div className="w-1 h-px bg-black"/>
            <div className="w-3 h-px bg-black"/>
            <div className="w-6 h-px bg-black"/>
            <div className="w-2 h-px bg-black"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Window;