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
import Image from "next/image";

export default function Services() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="relative">
        {/* Hero section cover photo */}
        <Image
          src="/photos/generic/air-canada.webp"
          alt="Family Photo"
          fill
          quality={100}
          preload
          style={{ objectFit: "cover", zIndex: -10 }}
        />

        {/* Hero section main content */}
        <Wrapper>
          <Headline className="text-white pt-[6rem] mb-0 md:pt-[23rem] lg:pt-[15rem]">
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
          <Headline className="text-center mx-auto">
            <Heading>Expert guidance across all immigration pathways</Heading>
          </Headline>

          {/* Services list */}
          <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li key={index}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  backgroundImg={service.backgroundImg}
                />
              </li>
            ))}
          </ul>
        </Wrapper>
      </Section>
    </main>
  );
}
