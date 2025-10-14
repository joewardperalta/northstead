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
      <Wrapper className="md:grid md:grid-cols-2 lg:grid-cols-3 md:space-y-0">
        <Headline>
          <Tagline>Step by step process</Tagline>
          <Heading>We make immigration simple</Heading>
        </Headline>

        {steps.map((step, index) => (
          <article key={index}>
            <StepCard
              title={step.title}
              description={step.description}
              backgroundImg={step.image}
              step={index + 1}
            />
          </article>
        ))}
      </Wrapper>
    </Section>
  );
}
