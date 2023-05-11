import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Req,
    UseGuards  } from '@nestjs/common';
import {AuthRequest, payload} from "src/types/auth"
  import { JWTAuthGuard } from './user.guard';
  import { UsersService } from './users.service';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService){}
    
    @Post('/signIn')
    async signIn(
        @Body('username') username: string,
        @Body('password') password: string,
    ){

        const result = await this.usersService.validateUser(username,password);
        const payload = await this.usersService.jwtCreate(result)
        return payload
    }

    @Get('getuser')
    @UseGuards(JWTAuthGuard)
    async getUser(@Req() req :AuthRequest)
    {
        const result = req.user   
        return result
        
    }

}
  