'use client';

import { HeartIcon } from "lucide-react";
import Image from "next/image";

const Studio = () => {
  return (
    <main className="w-full h-full">
      {/* === Header Section === */}
      <header className="relative overflow-hidden w-full h-52 sm:h-72 md:h-80 flex items-center justify-between">
        <Image
          src={'/images/studio-background-2.jpg'}
          alt="Studio Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        {/* Decorative Sidebar in Header - Hidden on mobile */}
        <div className="absolute z-5 w-full h-full bottom-0 bg-transparent hidden md:grid grid-cols-10">
          <div className="col-span-8 bg-transparent"></div>
          <div className="col-span-2">
            <div className="w-full h-auto flex flex-col gap-0.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full`}
                  style={{
                    height: `${i ** 1.2 + 1}px`,
                    backgroundColor: `rgba(255, 255, 255, ${0 + (i ** 1.2) / 22})`,
                  }}
                ></div>
              ))}
            </div>
            <div className="h-full bg-white px-4 py-2">
              <h1 className="text-2xl lg:text-4xl text-neutral-800 font-thin">
                Lorem Ipsum
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* === Main Content Section === */}
      {/* Using Flexbox for responsive layout */}
      <section className="w-full flex flex-col md:flex-row">
        {/* Recently Listened Section */}
        <div className="w-full md:grow p-4 sm:p-6 space-y-4">
          <h1 className="text-3xl md:text-4xl font-medium text-neutral-900">
            You have listened recently
          </h1>
          <div className="w-full grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full flex items-center gap-3 p-2 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center justify-center w-8">
                  <h1 className="text-lg text-neutral-500 font-medium">
                    {i + 1}
                  </h1>
                </div>
                <div className="w-12 h-12 bg-neutral-200 overflow-hidden relative">
                   {/* Placeholder for song image */}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-md md:text-lg font-medium text-neutral-800 truncate">
                    Judul yang berkelas
                  </h1>
                  <h3 className="text-sm text-neutral-600 font-regular truncate">
                    Artis Terkenal
                  </h3>
                </div>
                {/* Genre hidden on smaller screens */}
                <div className="hidden lg:flex items-center justify-start flex-1">
                  <h1 className="text-md text-neutral-600 font-regular">
                    Genre Music
                  </h1>
                </div>
                <div className="w-16 text-center text-neutral-600">
                  3:23
                </div>
                <div>
                  <div className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-200 cursor-pointer">
                    <HeartIcon className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Studio;
