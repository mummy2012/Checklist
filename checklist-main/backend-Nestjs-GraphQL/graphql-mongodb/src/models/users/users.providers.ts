import { users } from "./users.entity";

export const usersProviders = [
    {
      provide: 'users_REPOSITORY',
      useValue: users,
    },
  ];