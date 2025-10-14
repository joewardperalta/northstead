import Process from "@/components/Process";
import CallToAction from "@/components/CallToAction";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children} <Process /> <CallToAction />
    </>
  );
}
