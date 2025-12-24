'use client';

import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Upload, ListMusic, PlayCircle } from 'lucide-react';
import SoundWave from '@/components/widgets/SoundWave';
import clsx from 'clsx';
import { FeatureCardProps, StepProps, ButtonProps } from '@/types/interfaces';

const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={clsx("py-16 md:py-24 px-6 md:px-12", className)}
    >
      {children}
    </motion.section>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* === Hero Section === */}
      <header className="relative h-screen min-h-[640px] flex flex-col items-center justify-center text-center p-6">
        <div className="absolute inset-0 z-5 w-full h-full overflow-hidden">
          <SoundWave color="#ffffff" barCount={180}/>
        </div>
        <div className="absolute inset-0 w-full h-full bg-linear-to-t from-neutral-900 via-black to-black"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
            Your Sound, <br /> Redefined.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-400">
            The ultimate platform to upload, organize, and experience your personal music collection like never before.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {/* FIX: Removed as="a" from Button */}
            <Link href="/sign-up" passHref>
              <Button size="lg" variant="primary">Get Started</Button>
            </Link>
            <Link href="/sign-in" passHref>
              <Button size="lg" variant="secondary">Sign In</Button>
            </Link>
          </div>
        </motion.div>
      </header>

      <main>
        {/* === Features Section === */}
        <AnimatedSection className="border-t-2 border-white bg-linear-to-b from-neutral-900 to-neutral-950">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <FeatureCard
                icon={<Upload className="w-10 h-10 text-white" />}
                title="Upload & Go"
                description="Effortlessly upload your tracks. We handle the rest, from processing to secure storage."
              />
              <FeatureCard
                icon={<ListMusic className="w-10 h-10 text-white" />}
                title="Organize Intuitively"
                description="Create playlists, manage your songs, and find what you want to hear, instantly."
              />
              <FeatureCard
                icon={<PlayCircle className="w-10 h-10 text-white" />}
                title="Listen Anywhere"
                description="Stream your personal library on any device, anytime, with our sleek and modern player."
              />
            </div>
          </div>
        </AnimatedSection>

        {/* === How It Works Section === */}
        <AnimatedSection className='bg-neutral-950'>
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-4xl md:text-5xl text-white font-bold mb-12">Simple as 1, 2, 3</h2>
            <div className="relative grid md:grid-cols-3 gap-8 items-center">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-800 hidden md:block"></div>
              <div className="absolute top-1/2 left-0 w-full h-full justify-around items-center hidden md:flex">
                <div className="w-4 h-4 bg-neutral-800"></div>
                <div className="w-4 h-4 bg-neutral-800"></div>
                <div className="w-4 h-4 bg-neutral-800"></div>
              </div>
              <Step number="1" title="Upload Your Music" />
              <Step number="2" title="Create Playlists" />
              <Step number="3" title="Press Play" />
            </div>
          </div>
        </AnimatedSection>

        {/* === CTA Section === */}
        <AnimatedSection className="bg-black">
          <div className="container mx-auto max-w-4xl text-center bg-neutral-950 border border-neutral-800 p-12 md:p-20">
            <h2 className="text-4xl md:text-5xl text-white font-bold">Ready to Take Control?</h2>
            <p className="mt-4 text-lg text-neutral-300">
              Join now and start building your personal soundscape.
            </p>
            <div className="mt-8">
              {/* FIX: Removed as="a" from Button */}
              <Link href="/sign-up" passHref>
                <Button size="lg" variant="dark">Sign Up for Free <ArrowRight className='w-4 h-4 ml-2' /></Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </main>

      {/* === Footer === */}
      <footer className="text-center p-6 text-neutral-300 text-sm bg-neutral-900">
        <p>&copy; {new Date().getFullYear()} Your Sound Inc. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="border border-neutral-800 p-8 space-y-4 bg-neutral-900">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-2xl text-white font-bold">{title}</h3>
    <p className="text-neutral-300">{description}</p>
  </div>
);

const Step = ({ number, title }: StepProps) => (
  <div className="z-10 bg-neutral-950 text-center p-4">
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-neutral-300">Step {number}</p>
  </div>
);

const Button = <T extends React.ElementType = 'button'>({ as, variant, size, className, ...props }: ButtonProps<T>) => {
  const Comp = as || 'button';
  const styles = {
    base: 'inline-flex items-center justify-center font-semibold tracking-wide uppercase transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
    variant: {
      primary: 'bg-white text-black hover:bg-neutral-300',
      dark: 'bg-neutral-900 text-white hover:bg-neutral-800',
      secondary: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
    },
    size: {
      lg: 'px-8 py-4 text-sm',
      md: 'px-6 py-3 text-sm',
    }
  }

  return (
    <Comp className={clsx(styles.base, styles.variant[variant], styles.size[size], className)} {...props} />
  )
}
