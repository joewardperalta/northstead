import * as React from "react";
import Image from "next/image";
import TertiaryHeading from "./TertiaryHeading";

type TeamCardProps = {
  photo: string;
  name: string;
  role: string;
};

export default function TeamCard({ photo, name, role }: TeamCardProps) {
  return (
    <section>
      {/* Team member photo */}
      <div>
        <Image src={`/photos/${photo}`} alt="" width={1368} height={1440} />
      </div>

      {/* Team member info */}
      <div className="py-6">
        <TertiaryHeading className="mb-2">{name}</TertiaryHeading>
        <p>{role}</p>
      </div>
    </section>
  );
}
