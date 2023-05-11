import { Module } from '@nestjs/common';
import { get } from 'http';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService as ModelUserService } from 'src/models/npi_user/npi_user.service';
import { usersProviders } from 'src/models/npi_user/npi_user.providers';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule} from '@nestjs/passport'
import { SessionSerializer } from './session';

@Module({
    imports: [MongooseModule.forFeature([{name: 'User',schema: UserSchema }]), JwtModule.register({secret:process.env.SESSION_SECRET}), PassportModule.register({session:true}),],
    controllers: [UsersController],
    providers: [UsersService,JwtStrategy,SessionSerializer,ModelUserService,...usersProviders],
    exports: [JwtModule,JwtStrategy,PassportModule]
})

export class UsersModule {}
