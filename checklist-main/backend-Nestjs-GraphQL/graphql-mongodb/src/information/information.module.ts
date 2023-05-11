import { Module } from '@nestjs/common';
import { InformationService } from './information.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InformationController } from './information.controller';
import { InformationSchema } from './information.model';
import { busService } from 'src/models/bus/bus.service';
import { busProviders } from 'src/models/bus/bus.providers';
import {expansionsService} from "../models/expansion_shop/expansion_shop.service"
import {expansionsProviders} from "../models/expansion_shop/expansion_shop.providers"

@Module({
  imports: [MongooseModule.forFeature([{name:'Information',schema: InformationSchema }])],
  controllers:[InformationController],
  providers: [InformationService,busService,...busProviders,expansionsService,...expansionsProviders]
})
export class InformationModule {}
