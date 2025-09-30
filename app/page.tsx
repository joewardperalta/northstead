import Headline from "@/components/Headline";
import Section from "@/components/Section";
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
    </main>
  );
}
