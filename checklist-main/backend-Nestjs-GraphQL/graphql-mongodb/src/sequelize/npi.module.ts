import { Module } from '@nestjs/common';
import { databaseProviders } from './npi.providers';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule { }