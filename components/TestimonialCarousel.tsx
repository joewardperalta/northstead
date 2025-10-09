"use client";
import * as React from "react";
import TestimonialCard from "./TestimonialCard";
import { useState } from "react";
import Image from "next/image";

type Testimony = {
  message: string;
  author: string;
  role: string;
  photo: string;
};

type TestimonialCarouselProps = {
  testimonies: Testimony[];
};

export default function TestimonialCarousel({
  testimonies,
}: TestimonialCarouselProps) {
  const [currentTestimony, setCurrentTestimony] = useState(0);

  function handlePrevClick() {
    const newIndex =
      (currentTestimony - 1 + testimonies.length) % testimonies.length;
    setCurrentTestimony(newIndex);
  }

  function handleNextClick() {
    const newIndex = (currentTestimony + 1) % testimonies.length;
    setCurrentTestimony(newIndex);
  }

  return (
    <section>
      <TestimonialCard
        author={testimonies[currentTestimony].author}
        testimony={testimonies[currentTestimony].message}
        role={testimonies[currentTestimony].role}
        photo={testimonies[currentTestimony].photo}
      />

      {/* Controller */}
      <div className="mt-6 space-x-6 flex justify-end">
        <button className="cursor-pointer" onClick={handlePrevClick}>
          <Image
            className="w-8 h-8"
            src="/icons/left-arrow-thin.png"
            alt=""
            width={64}
            height={64}
          />
        </button>
        <button className="cursor-pointer" onClick={handleNextClick}>
          <Image
            className="w-8 h-8"
            src="/icons/right-arrow-thin.png"
            alt=""
            width={64}
            height={64}
          />
        </button>
      </div>
    </section>
  );
}
