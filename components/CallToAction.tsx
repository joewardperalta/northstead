import Link from "next/link";
import Heading from "./Heading";
import Headline from "./Headline";
import Section from "./Section";
import SubHeading from "./SubHeading";
import Wrapper from "./Wrapper";

export default function CallToAction() {
  return (
    <Section className="bg-[url(/photos/canada-lake.png)] bg-cover bg-center ">
      <Wrapper>
        <Headline className="text-center">
          <Heading className="text-white text-[3.5rem]">
            Your new life starts here
          </Heading>
          <SubHeading className="text-white">
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
