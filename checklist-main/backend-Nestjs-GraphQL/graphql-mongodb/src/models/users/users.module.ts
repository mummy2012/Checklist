import { Module } from '@nestjs/common';
import { usersService } from './users.service';
import { usersProviders } from './users.providers';
import { DatabaseModule } from '../../sequelize/npi.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        usersService,
        ...usersProviders,
    ],
})
export class usersServiceModule { }