import * as React from "react";
import Section from "./Section";
import Wrapper from "./Wrapper";
import Headline from "./Headline";
import Heading from "./Heading";
import Tagline from "./Tagline";
import StepCard from "./StepCard";

import steps from "@/data/process.json";

export default function Process() {
  return (
    <Section className="bg-primary text-white">
      <Wrapper>
        <Headline>
          <Tagline>Step by step process</Tagline>
          <Heading>We make immigration simple</Heading>
        </Headline>

        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              title={step.title}
              description={step.description}
              backgroundImg={step.image}
              step={index + 1}
            />
          ))}
        </div>
      </Wrapper>
    </Section>
  );
}
