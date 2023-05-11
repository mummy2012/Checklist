import { expansions } from "./expansion_shop.entity";

export const expansionsProviders = [
    {
      provide: 'expansions_REPOSITORY',
      useValue: expansions,
    },
  ];