"use client";
import Section from "./Section";
import Wrapper from "./Wrapper";
import Headline from "./Headline";
import Heading from "./Heading";
import Tagline from "./Tagline";
import TertiaryHeading from "./TertiaryHeading";
import { useState } from "react";

const benefits = [
  {
    title: "Client care",
    description:
      "We listen to your needs and provide personalized guidance with compassion and attention to detail.",
    image: "client-care.png",
  },
  {
    title: "Proven expertise",
    description:
      "With over a decade of experience, we deliver accurate, up-to-date advice and strong representation.",
    image: "ongoing-support.png",
  },
  {
    title: "Ongoing support",
    description:
      "From consultation to approval and beyond, we stand by you every step of the way.",
    image: "proven-expertise.png",
  },
];

const achievements = [
  {
    title: "10+",
    description: "Years experience",
  },
  {
    title: "5000+",
    description: "Clients served",
  },
  {
    title: "95%",
    description: "Approval rate",
  },
];

export default function WhyChooseUs() {
  const [benefit, setBenefit] = useState(benefits[0]);

  return (
    <Section>
      <Wrapper>
        <div className="space-y-12 mb-8">
          <Headline>
            <Tagline isDarkTheme>Why choose us</Tagline>
            <Heading className="mb-0">
              We provide expert immigration services designed for your success.
            </Heading>
          </Headline>

          {/* Switch Controller */}
          <ul className="text-xl leading-[1.4] space-y-6">
            <li>
              <button onClick={() => setBenefit(benefits[0])}>
                Client care
              </button>
            </li>
            <li>
              <button onClick={() => setBenefit(benefits[1])}>
                Proven expertise
              </button>
            </li>
            <li>
              <button onClick={() => setBenefit(benefits[2])}>
                Ongoing support
              </button>
            </li>
          </ul>

          <dl className="flex gap-8">
            {achievements.map((achievement, index) => (
              <div className="w-full" key={index}>
                <dt className="text-2xl leading-[1.4] text-primary font-semibold">
                  {achievement.title}
                </dt>
                <dd className="text-gray text-xs leading-[1.4]">
                  {achievement.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Benefit card */}
        <div
          className="p-6 bg-cover text-white"
          style={{ backgroundImage: `url('/photos/${benefit.image}')` }}
        >
          <div className="pt-[10rem]">
            <TertiaryHeading className="text-xl leading-[1.4] mb-4 ">
              {benefit.title}
            </TertiaryHeading>
            <p>{benefit.description}</p>
          </div>
        </div>
      </Wrapper>
    </Section>
  );
}
