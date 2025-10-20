"use client";
import * as React from "react";
import Image from "next/image";
import TertiaryHeading from "./TertiaryHeading";
import Headline from "./Headline";
import Heading from "./Heading";
import { useState, useEffect } from "react";

type Bio = {
  about: string | null;
  experience: string | null;
  education: string | null;
  strengths: string | null;
  background: string | null;
  commitment: string | null;
};

type Social = {
  label: string;
  link: string;
};

type TeamCardProps = {
  photo: string;
  name: string;
  role: string;
  bio: Bio;
  socials: Social[];
};

export default function TeamCard({
  photo,
  name,
  role,
  bio,
  socials,
}: TeamCardProps) {
  const [isOpen, setisOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // disable page scroll
    } else {
      document.body.style.overflow = ""; // restore scroll
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section>
      <div className="w-full cursor-pointer" onClick={() => setisOpen(true)}>
        {/* Team member photo */}
        <div className="h-[30rem]">
          <Image
            src={`/photos/${photo}`}
            className="w-full h-full object-cover object-top"
            alt=""
            width={1368}
            height={1440}
          />
        </div>

        {/* Team member info */}
        <div className="py-6">
          <TertiaryHeading className="mb-2">{name}</TertiaryHeading>
          <p>{role}</p>
        </div>
      </div>

      {/* Bio overlay */}
      {isOpen && (
        <div className="fixed left-0 top-0 bg-white h-full w-full flex">
          {/* Photo */}
          <div>
            <Image
              src={`/photos/${photo}`}
              className="w-full object-contain"
              alt=""
              width={2000}
              height={2000}
              priority
            />
          </div>

          {/* Body */}
          <div className="relative py-[5rem] px-[10rem] overflow-y-auto w-full">
            <div>
              {/* About */}
              <section>
                <Headline className="text-left">
                  <Heading className="capitalize">About {name}</Heading>
                  <p>{bio.about && bio.about}</p>
                </Headline>
              </section>

              {/* Background */}
              <section className="text-left">
                <Headline>
                  <TertiaryHeading>Background</TertiaryHeading>
                  <p>{bio.background && bio.background}</p>
                </Headline>
              </section>

              {/* Experience */}
              <section className="text-left">
                <Headline>
                  <TertiaryHeading>Professional Experience</TertiaryHeading>
                  <p>{bio.experience && bio.experience}</p>
                </Headline>
              </section>

              {/* Strengths */}
              <section className="text-left">
                <Headline>
                  <TertiaryHeading>Core Strengths</TertiaryHeading>
                  <p>{bio.strengths && bio.strengths}</p>
                </Headline>
              </section>

              {/* Commitment */}
              <section className="text-left">
                <Headline>
                  <TertiaryHeading>Commitment</TertiaryHeading>
                  <p>{bio.commitment && bio.commitment}</p>
                </Headline>
              </section>

              <section>
                <Headline>
                  <TertiaryHeading>Follow me</TertiaryHeading>

                  <ul>
                    {socials.map((social, index) => (
                      <li key={index} className="w-fit">
                        <a
                          className="underline"
                          target="_blank"
                          href={social.link}
                        >
                          <svg
                            height="512"
                            viewBox="0 0 176 176"
                            width="512"
                            xmlns="http://www.w3.org/2000/svg"
                            id="fi_3536505"
                            className="w-8 h-8"
                          >
                            <g id="Layer_2" data-name="Layer 2">
                              <g id="linkedin">
                                <rect
                                  id="background"
                                  fill="#0077b5"
                                  height="176"
                                  rx="24"
                                  width="176"
                                ></rect>
                                <g id="icon" fill="#fff">
                                  <path d="m63.4 48a15 15 0 1 1 -15-15 15 15 0 0 1 15 15z"></path>
                                  <path d="m60 73v66.27a3.71 3.71 0 0 1 -3.71 3.73h-15.81a3.71 3.71 0 0 1 -3.72-3.72v-66.28a3.72 3.72 0 0 1 3.72-3.72h15.81a3.72 3.72 0 0 1 3.71 3.72z"></path>
                                  <path d="m142.64 107.5v32.08a3.41 3.41 0 0 1 -3.42 3.42h-17a3.41 3.41 0 0 1 -3.42-3.42v-31.09c0-4.64 1.36-20.32-12.13-20.32-10.45 0-12.58 10.73-13 15.55v35.86a3.42 3.42 0 0 1 -3.37 3.42h-16.42a3.41 3.41 0 0 1 -3.41-3.42v-66.87a3.41 3.41 0 0 1 3.41-3.42h16.42a3.42 3.42 0 0 1 3.42 3.42v5.78c3.88-5.82 9.63-10.31 21.9-10.31 27.18 0 27.02 25.38 27.02 39.32z"></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Headline>
              </section>
            </div>

            {/* Exit */}
            <button
              className="absolute right-[2.5rem] top-[2rem] w-5 h-5 cursor-pointer"
              onClick={() => setisOpen(false)}
            >
              <svg
                height="329pt"
                viewBox="0 0 329.26933 329"
                width="329pt"
                xmlns="http://www.w3.org/2000/svg"
                id="fi_1828778"
                className="w-full h-full"
              >
                <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
