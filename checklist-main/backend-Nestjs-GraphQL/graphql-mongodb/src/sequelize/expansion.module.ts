import { Module } from '@nestjs/common';
import { databaseProviders } from './expansion.providers';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DBExpasionModule { }