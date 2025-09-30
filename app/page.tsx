import Heading from "@/components/Heading";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import SubHeading from "@/components/SubHeading";
import SubTitle from "@/components/SubTitle";
import Tagline from "@/components/Tagline";
import Title from "@/components/Title";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";

export default function Home() {
  return (
    <main>
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
    </main>
  );
}
