// import Section from "@/components/Section";
// import Wrapper from "@/components/Wrapper";
// import Heading from "@/components/Heading";
// import Headline from "@/components/Headline";
// import SubHeading from "@/components/SubHeading";
// import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {/* 
      <Section className="bg-[url(/photos/happy-dad-and-son.jpg)] bg-cover bg-center py-[7.5rem] relative">
        <div className="bg-black/50 absolute left-0 top-0 w-full h-full"></div>

        <Wrapper className="relative">
          <Headline className="text-center mx-auto md:pb-11">
            <Heading className="text-white text-[3.5rem] md:text-[5.5rem] md:leading-[1] md:mb-6">
              Tell us about your experience
            </Heading>
            <SubHeading className="text-white md:text-[1.5rem] md:max-w-[30rem] md:mx-auto">
              We value your feedback and would love to hear your thoughts.
            </SubHeading>
          </Headline>

          <Link href="/booking" className="btn mx-auto">
            Send us feedback
          </Link>
        </Wrapper>
      </Section> */}
    </>
  );
}
