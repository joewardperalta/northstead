// Data
import services from "@/data/services.json";

// Components
import Section from "@/components/Section";
import Wrapper from "@/components/Wrapper";
import Tagline from "@/components/Tagline";
import Title from "@/components/Title";
import Headline from "@/components/Headline";
import SubTitle from "@/components/SubTitle";
import Heading from "@/components/Heading";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";

export default function Services() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-[url(/photos/air-canada.png)] bg-cover bg-left">
        <Wrapper>
          <Headline className="text-white pt-[6rem] mb-0">
            <Tagline>Services</Tagline>
            <Title>Choose your pathway to Canada</Title>
            <SubTitle>
              We provide a wide range of immigration services tailored to meet
              your unique needs. Whether you’re coming as a caregiver, worker,
              student, or looking to settle permanently, we’re here to guide you
              every step of the way
            </SubTitle>
          </Headline>
        </Wrapper>
      </Section>

      {/* Services section */}
      <Section>
        <Wrapper>
          <Headline>
            <Heading>Expert guidance across all immigration pathways</Heading>
          </Headline>

          {/* Services list */}
          <ul className="flex flex-col gap-4">
            {services.map((service, index) => (
              <li key={index}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  link={service.link}
                  backgroundImg={service.backgroundImg}
                />
              </li>
            ))}
          </ul>
        </Wrapper>
      </Section>
    </>
  );
}
