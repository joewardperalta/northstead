import Process from "@/components/Process";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children} <Process />
    </>
  );
}
