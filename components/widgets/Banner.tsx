import { BannerIcons } from "@/lib/constants";
import Image from "next/image";

const Banner = () => {
  return (
    <>
      <div className="w-full relative flex justify-end">
        <div className="inverted-radius-back max-w-xl w-full h-[430px] bg-neutral-300 p-px">
          <div className="inverted-radius-back w-full h-full bg-white p-1 flex items-center justify-center">
            <div className="inverted-radius overflow-hidden relative">
              <Image src={'/images/landing-image3.jpg'} alt="Landing Page Image" className="w-full h-full object-cover" width={600} height={600} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 w-[280px] h-auto p-6 bg-linear-to-br from-fuchsia-100/40 to-transparent backdrop-blur-sm rounded-3xl border border-neutral-300/50">
          <h1 className="text-transparent bg-clip-text font-semibold text-4xl bg-linear-to-r from-pink-400 to-blue-400 via-fuchsia-400">Listen More</h1>
          <p className="text-sm font-regular text-neutral-100">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit similique itaque dolorum.</p>
        </div>
        {BannerIcons.map((icon, index) => {
          const MusicIcon = icon.icon;
          return (
            <div key={index+1} className={`absolute ${icon.position} rounded-full p-2 bg-linear-to-br from-blue-300/30 to-fuchsia-300/20 backdrop-blur-sm border border-fuchsia-300/30 flex items-center justify-center`}>
              <MusicIcon className="w-5 h-5 text-fuchsia-200"/>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Banner;