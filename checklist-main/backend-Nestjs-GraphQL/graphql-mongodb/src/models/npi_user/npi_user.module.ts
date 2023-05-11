import { Module } from '@nestjs/common';
import { UsersService } from './npi_user.service';
import { usersProviders } from './npi_user.providers';
import { DatabaseModule } from '../../sequelize/npi.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        UsersService,
        ...usersProviders,
    ],
})
export class UsersModule { }