import { bus } from "./bus.entity";

export const busProviders = [
    {
      provide: 'bus_REPOSITORY',
      useValue: bus,
    },
  ];