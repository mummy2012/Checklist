import { Module } from '@nestjs/common';
import { busService } from './bus.service';
import { busProviders } from './bus.providers';
import { DBExpasionModule } from '../../sequelize/expansion.module';

@Module({
    imports: [DBExpasionModule],
    providers: [
        busService,
        ...busProviders,
    ],
})
export class busServiceModule { }