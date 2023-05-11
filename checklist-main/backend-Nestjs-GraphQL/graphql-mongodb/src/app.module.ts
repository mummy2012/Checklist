import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { InformationModule } from './information/information.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './sequelize/npi.module';
import {DBExpasionModule} from "./sequelize/expansion.module"
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { join } from 'path';
import { SheetModule } from './sheet/sheet.module';
import { S3Module } from './aws/s3.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({ useFactory: () => ({
      uri: process.env.MONGOOSE_PORT,
      }),
    }),
    ConfigModule.forRoot(),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   installSubscriptionHandlers: true,
    //   autoSchemaFile: join(process.cwd(),'src/graphQL/schema.gql'),
    //   debug: false,
    //   sortSchema: true,
    //   playground: true,
    // }),
    InformationModule,
    UsersModule,
    SheetModule,
    DatabaseModule,
    DBExpasionModule,
    S3Module
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
