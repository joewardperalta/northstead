interface Other {
  description: string;
  source: string;
}

interface Requirements {
  label: string;
  description: string;
  other: Other[];
}

interface Service {
  title: string;
  requirements: Requirements[];
}

export default function getServiceByName(
  title: string,
  services: Service[]
): Service | undefined {
  return services.find((service) => service.title === title);
}
