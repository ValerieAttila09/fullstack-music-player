"use client";

import { HeartIcon } from "lucide-react";
import Image from "next/image";

const Studio = () => {

  return (
    <main className="w-full h-full">
      <header className="relative overflow-hidden w-full sm:h-72 md:h-86 flex items-center justify-between">
        <Image src={"/images/studio-background-2.jpg"} alt="Studio Background" width={1080} height={480} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute z-5 w-full h-full bottom-0 bg-transparent grid grid-cols-10">
          <div className="col-span-8 bg-transparent"></div>
          <div className="col-span-2">
            <div className="w-full h-auto flex flex-col gap-0.5">
              {Array.from({ length: 16 }).map((_, i) => {
                return (
                  <div className={`w-full`} style={{ 
                    height: `${i ** 1.2 + 1}px`,
                    backgroundColor: `rgba(255, 255, 255, ${0+((i**1.2)/22)})`
                  }} key={i + 1}></div>
                )
              })}
            </div>
            <div className="h-full bg-white">
              <h1 className="text-4xl text-neutral-800 font-thin">Lorem Ipsum</h1>
            </div>
          </div>
        </div>
      </header>
      <section className="w-full grid grid-cols-10">
        <div className="col-span-8 space-y-4 p-6">
          <h1 className="text-4xl font-medium text-neutral-900">You have listened recently</h1>
          <div className="w-full grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <div key={i} className="w-full grid grid-cols-12 gap-2">
                  <div className="col-span-1 flex items-center justify-center">
                    <h1 className="text-xl text-neutral-500 font-medium text-center">{i + 1}</h1>
                  </div>
                  <div className="col-span-1 w-12 h-12 bg-neutral-200"></div>
                  <div className="col-span-4 flex flex-col items-start justify-center">
                    <h1 className="text-lg/5 text-neutral-800 font-medium">Judul yang berkelas</h1>
                    <h3 className="text-sm text-neutral-600 font-regular">Artis Terkenal</h3>
                  </div>
                  <div className="col-span-3 flex items-center justify-start">
                    <h1 className="text-md text-neutral-600 font-regular">Genre Music</h1>
                  </div>
                  <div className="col-span-2">
                    3:23
                  </div>
                  <div className="col-span-1">
                    <div className="rounded-full w-7 h-7 p-1 bg-neutral-100">
                      <HeartIcon className="w-5 h-5 text-neutral-400" size={20} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="col-span-2">
          <div className="w-full h-full flex flex-col gap-0.5">
            {Array.from({ length: 18 }).map((_, i) => {
              return (
                <div className={`w-full bg-neutral-800`} style={{ height: `${i ** 1.25 + 1}px` }} key={i + 1}></div>
              )
            })}
            <div className="w-full h-full bg-neutral-800 py-4">
              <h1 className="text-white text-4xl font-thin">Lorem Ipsum</h1>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Studio;