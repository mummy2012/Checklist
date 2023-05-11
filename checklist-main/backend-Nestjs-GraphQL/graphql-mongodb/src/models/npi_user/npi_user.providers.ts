import { User } from "./npi_user.entity";

export const usersProviders = [
    {
      provide: 'USERS_REPOSITORY',
      useValue: User,
    },
  ];