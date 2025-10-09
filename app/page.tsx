// Data
import services from "@/data/services.json";
import members from "@/data/members.json";
import testimonials from "@/data/testimonials.json";

// Components
import Heading from "@/components/Heading";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
import SubHeading from "@/components/SubHeading";
import SubTitle from "@/components/SubTitle";
import Tagline from "@/components/Tagline";
import Title from "@/components/Title";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import TeamCard from "@/components/TeamCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-[url(/photos/family-smiling.png)] bg-cover bg-center">
        <Wrapper>
          <Headline className="text-white pt-[6rem] mb-0">
            <Tagline>Guiding you every step of the way</Tagline>
            <Title>Your trusted partner in Canadian immigration</Title>
            <SubTitle>
              We help individuals, families, and businesses navigate visas, work
              permits, and permanent residency with ease and confidence.
            </SubTitle>
            <Link className="btn" href="/booking">
              Book a consultation
            </Link>
          </Headline>
        </Wrapper>
      </Section>

      {/* About section */}
      <Section>
        <Wrapper>
          <Headline className="mb-0">
            <Tagline isDarkTheme={true}>About us</Tagline>
            <Heading>
              At Northstead Immigration, we guide your journey and help you
              build a future in Canada.
            </Heading>
            <SubHeading>
              We are passionate about making immigration simple, transparent,
              and stress-free. Our expert guidance and personalized support turn
              challenges into opportunities. We help families reunite and open
              doors to careers, studies, and new lives in Canada.
            </SubHeading>
            <Link className="btn primary-btn" href="/booking">
              Learn more
            </Link>
          </Headline>
        </Wrapper>
      </Section>

      {/* Services section */}
      <Section>
        <Wrapper>
          <Headline>
            <Tagline isDarkTheme={true}>Our services</Tagline>
            <Heading>
              We provide expert immigration services designed for your success.
            </Heading>
          </Headline>

          {/* Services list */}
          <ul className="flex flex-col gap-4">
            {services.map(
              (service, index) =>
                service.featured && (
                  <li key={index}>
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      link={service.link}
                      backgroundImg={service.backgroundImg}
                    />
                  </li>
                )
            )}
          </ul>

          <Link className="btn primary-btn mt-8" href="/services">
            View all services
          </Link>
        </Wrapper>
      </Section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Step-by-step process section */}
      <Process />

      {/* Team section */}
      <Section className="bg-primary-light">
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

      {/* Testimonial section */}
      <Section>
        <Wrapper>
          <TestimonialCarousel testimonies={testimonials} />
        </Wrapper>
      </Section>
    </>
  );
}
