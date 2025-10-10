interface Requirements {
  label: string;
  description: string;
  other: string[];
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
