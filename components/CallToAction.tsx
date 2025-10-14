import Link from "next/link";
import Heading from "./Heading";
import Headline from "./Headline";
import Section from "./Section";
import SubHeading from "./SubHeading";
import Wrapper from "./Wrapper";

export default function CallToAction() {
  return (
    <Section className="bg-[url(/photos/canada-lake.png)] bg-cover bg-center py-[7.5rem]">
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
