// Data
import testimonials from "@/data/testimonials.json";

// Components
import Heading from "@/components/Heading";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import SubHeading from "@/components/SubHeading";
import SubTitle from "@/components/SubTitle";
import Tagline from "@/components/Tagline";
import Title from "@/components/Title";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <Section className="relative">
          {/* Hero section cover photo */}
          <Image
            src="/photos/generic/family-smiling.webp"
            alt="Family Photo"
            fill
            quality={100}
            preload
            style={{ objectFit: "cover", zIndex: -10 }}
          />

          {/* Hero section main content */}
          <Wrapper>
            <Headline className="text-white pt-[6rem] mb-0 md:pt-[23rem] lg:pt-[15rem]">
              <Tagline>Guiding you every step of the way</Tagline>
              <Title>Your trusted partner in Canadian immigration</Title>
              <SubTitle>
                We help individuals, families, and businesses navigate visas,
                work permits, and permanent residency with ease and confidence.
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
            <Headline className="mb-0 md:flex md:max-w-full md:justify-between md:gap-4 md:items-center lg:gap-[9rem]">
              <div className="w-full">
                <Tagline isDarkTheme={true}>About us</Tagline>
                <Heading>
                  At Northstead Immigration, we guide your journey and help you
                  build a future in Canada.
                </Heading>
              </div>
              <div className="w-full">
                <SubHeading className="mb-6">
                  We are passionate about making immigration simple,
                  transparent, and stress-free. Our expert guidance and
                  personalized support turn challenges into opportunities. We
                  help families reunite and open doors to careers, studies, and
                  new lives in Canada.
                </SubHeading>
                <Link className="btn primary-btn" href="/about">
                  Learn more
                </Link>
              </div>
            </Headline>
          </Wrapper>
        </Section>

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Step-by-step process section */}
        <Process />

        {/* Testimonial section */}
        <Section>
          <Wrapper>
            <TestimonialCarousel testimonies={testimonials} />
          </Wrapper>
        </Section>

        <CallToAction />
      </main>

      <Footer />
    </>
  );
}
