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

export default function CaregiverProgram() {
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

          {/* Requirements */}
          <ul className="space-y-6">
            {service?.requirements.map((requirement, index) => (
              <li className="flex gap-3" key={index}>
                {/* Right arrow */}
                <Image
                  className="inline-block w-3 h-3 mt-2.5"
                  src="/icons/right-arrow-black.png"
                  alt=""
                  width={32}
                  height={32}
                />

                {/* Content */}
                <div>
                  <TertiaryHeading>{requirement.label}</TertiaryHeading>
                  <p className="text-lg mb-6">{requirement.description}</p>
                  <ul className="space-y-2">
                    {requirement.other.map((bullet, index) => (
                      <li key={index} className="list-disc">
                        <a href={bullet.source} target="_blank">
                          {bullet.description}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Wrapper>
      </Section>
    </>
  );
}
