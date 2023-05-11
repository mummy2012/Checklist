import { Module } from '@nestjs/common';
import { expansionsService } from './expansion_shop.service';
import { expansionsProviders } from './expansion_shop.providers';
import { DatabaseModule } from '../../sequelize/npi.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        expansionsService,
        ...expansionsProviders,
    ],
})
export class expansionsServiceModule { }