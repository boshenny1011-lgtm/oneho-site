'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ArchitectureCardProps {
  title: string;
  items: string[];
  imageSrc: string;
  index: number;
}

export function ArchitectureCard({ title, items, imageSrc, index }: ArchitectureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group overflow-hidden rounded-lg transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="relative h-[500px] w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />

        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
          <h3 className="text-2xl md:text-3xl text-white font-light mb-6 tracking-tight">{title}</h3>
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li
                key={idx}
                className={`text-neutral-300 font-light text-sm md:text-base transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 150 + idx * 100 + 300}ms` }}
              >
                <span className="inline-block w-6 h-px bg-neutral-500 mr-3 align-middle" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
