// Data
import members from "@/data/members.json";
import testimonials from "@/data/testimonials.json";

// Components
import Section from "@/components/Section";
import Wrapper from "@/components/Wrapper";
import Tagline from "@/components/Tagline";
import Title from "@/components/Title";
import Headline from "@/components/Headline";
import SubTitle from "@/components/SubTitle";
import Image from "next/image";
import Heading from "@/components/Heading";
import TeamCard from "@/components/TeamCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import BenefitCard from "@/components/BenefitCard";

// Constants
const values = [
  {
    title: "Integrity",
    description: "We act with honesty and professionalism in every case.",
  },
  {
    title: "Clarity",
    description: "We simplify complex processes and provide clear guidance.",
  },
  {
    title: "Care",
    description: "We put people first, tailoring support to your unique needs.",
  },
  {
    title: "Expertise",
    description: "We stay up to date with immigration laws and policies.",
  },
  {
    title: "Support",
    description: "We are here before, during, and after your application.",
  },
];

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-[url(/photos/team-meeting.png)] bg-cover bg-left">
        <Wrapper>
          <Headline className="text-white pt-[6rem] mb-0 md:pt-[23rem] lg:pt-[15rem]">
            <Tagline>About us</Tagline>
            <Title>Helping you build a future in Canada</Title>
            <SubTitle>
              At Northstead Immigration, we believe every journey deserves
              clarity, care, and confidence. Our mission is to guide you with
              expertise and compassion, making the process simple and
              stress-free.
            </SubTitle>
          </Headline>
        </Wrapper>
      </Section>

      <Section>
        <Wrapper>
          <Headline>
            <Tagline isDarkTheme>Our story</Tagline>
            <p className="text-2xl md:text-[1.75rem]">
              Northstead Immigration was founded on the belief that moving to a
              new country should open doors, not create stress. We guide
              families, professionals, and students with expertise and care to
              turn dreams into new beginnings in Canada.
            </p>
          </Headline>
        </Wrapper>
      </Section>

      {/* Gallery */}
      <Section className="py-0">
        <div className="flex gap-2 h-[20rem] md:h-[40rem]">
          <div>
            <Image
              className="h-full object-cover"
              src="/photos/successful-student.png"
              alt=""
              width={3239}
              height={2848}
            />
          </div>

          <div className="hidden md:block">
            <Image
              className="h-full object-cover"
              src="/photos/successful-caregiver.png"
              alt=""
              width={3239}
              height={2848}
            />
          </div>

          <div className="hidden md:block">
            <Image
              className="h-full object-cover"
              src="/photos/successful-family-sponsorship.png"
              alt=""
              width={3239}
              height={2848}
            />
          </div>
        </div>
      </Section>

      <Section>
        <Wrapper className="md:flex md:gap-[5.5rem] md:items-center">
          <div className="md:w-full">
            <Headline>
              <Heading>The values that guide us</Heading>
            </Headline>

            {/* Values */}
            <ul className="space-y-6 mb-12">
              {values.map((value, index) => (
                <li key={index}>
                  <BenefitCard
                    title={value.title}
                    description={value.description}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Team photo */}
          <div className="md:w-full">
            <Image
              src="/photos/immigration-team-smiling.png"
              alt=""
              width={2720}
              height={2648}
            />
          </div>
        </Wrapper>
      </Section>

      {/* Team section */}
      <Section>
        <Wrapper>
          <Headline className="text-center">
            <Heading>Meet our professional team</Heading>
          </Headline>

          {/* Team members */}
          <ul className="space-y-4">
            {members.map((member, index) => (
              <li key={index}>
                <TeamCard
                  name={member.name}
                  role={member.role}
                  photo={member.photo}
                />
              </li>
            ))}
          </ul>
        </Wrapper>
      </Section>

      <Section className="bg-primary-light">
        <Wrapper>
          <TestimonialCarousel testimonies={testimonials} />
        </Wrapper>
      </Section>
    </>
  );
}
