import * as React from "react";
import Image from "next/image";

type TestimonialCardProps = {
  author: string;
  role: string;
  testimony: string;
  photo: string;
};

export default function TestimonialCard({
  author,
  role,
  testimony,
  photo,
}: TestimonialCardProps) {
  return (
    <div className="md:grid md:grid-cols-2 md:gap-[2rem] md:items-center">
      {/* Author photo */}
      <div className="h-full mb-6 md:mb-0">
        <Image
          className="w-full h-full object-cover"
          src={`/photos/generic/${photo}`}
          alt=""
          width={680}
          height={490}
        />
      </div>

      {/* Body */}
      <div>
        <p className="text-xl mb-8 md:text-[1.75rem]">{testimony}</p>
        <div>
          <p className="text-xl mb-2">{author}</p>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
}
