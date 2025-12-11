import Link from "next/link";
import Heading from "./Heading";
import Headline from "./Headline";
import Section from "./Section";
import SubHeading from "./SubHeading";
import Wrapper from "./Wrapper";
import Image from "next/image";

export default function CallToAction() {
  return (
    <Section className="relative py-[7.5rem]">
      {/* Hero section cover photo */}
      <Image
        src="/photos/generic/canada-lake.webp"
        alt="Canada lake"
        fill
        quality={100}
        preload
        style={{ objectFit: "cover", zIndex: -10 }}
      />

      {/* Hero section main content */}
      <Wrapper>
        <Headline className="text-center mx-auto md:pb-11">
          <Heading className="text-white text-[3.5rem] md:text-[5.5rem] md:leading-[1] md:mb-6">
            Your new life starts here
          </Heading>
          <SubHeading className="text-white md:text-[1.5rem] md:max-w-[30rem] md:mx-auto">
            Expert guidance to make immigration simple, secure, and stress-free.
          </SubHeading>
        </Headline>

        <Link href="/booking" className="btn mx-auto">
          Book a consultation
        </Link>
      </Wrapper>
    </Section>
  );
}
