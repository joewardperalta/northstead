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
    <div>
      {/* Author photo */}
      <div className="h-[22.5rem] mb-6">
        <Image
          className="w-full h-full object-cover"
          src={`/photos/${photo}`}
          alt=""
          width={680}
          height={490}
        />
      </div>

      {/* Body */}
      <div>
        <p className="text-xl mb-8">{testimony}</p>

        <div>
          <p className="text-xl mb-2">{author}</p>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
}
