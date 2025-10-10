// Data
import services from "@/data/services.json";

// Utilities
import getServiceByName from "@/utils/getServiceByName";

// Components
import Section from "@/components/Section";
import Wrapper from "@/components/Wrapper";
import Title from "@/components/Title";
import Headline from "@/components/Headline";
import SubTitle from "@/components/SubTitle";
import Image from "next/image";
import Heading from "@/components/Heading";
import TertiaryHeading from "@/components/TertiaryHeading";

export default function About() {
  const service = getServiceByName("Caregiver program", services);

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-[url(/photos/air-canada.png)] bg-cover bg-left">
        <Wrapper>
          <Headline className="text-white pt-[6rem] mb-0">
            <Title>Caregiver program</Title>
            <SubTitle>
              We make Canadian immigration simple. Our team reviews your
              background and goals to guide you on the right path, whether work,
              study, caregiver, permanent residency, or citizenship, so you can
              move forward with confidence and peace of mind.
            </SubTitle>
          </Headline>
        </Wrapper>
      </Section>

      {/* Eligibility and requirements section */}
      <Section>
        <Wrapper>
          <Headline>
            <Heading>Eligibility & requirements</Heading>
          </Headline>

          {/* requirements */}
          <ul className="space-y-6 mb-12">
            {service?.requirements.map((requirement, index) => (
              <li className="flex gap-3" key={index}>
                <Image
                  className="inline-block w-3 h-3 mt-3"
                  src="/icons/right-arrow-black.png"
                  alt=""
                  width={32}
                  height={32}
                />

                <div>
                  <TertiaryHeading>{requirement.label}</TertiaryHeading>
                  <p>{requirement.description}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Supporting image */}
          <div>
            <Image
              src="/photos/consultation-with-client.png"
              alt=""
              width={2720}
              height={2648}
            />
          </div>
        </Wrapper>
      </Section>
    </>
  );
}
