import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/models/npi_user/npi_user.service';
import { payload } from 'src/types/auth';
import moment from 'moment';
import bcrypt from 'bcryptjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UsersService) {
    super({
      secretOrKey: process.env.SESSION_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: payload) {
    try {
      if (!payload || !payload.checklistuser)
        throw new UnauthorizedException('Unauthorized');
      let today = moment().valueOf();
      if (process.env.NODE_ENV != 'development') {
        if (today > payload.exp) throw { message: 'Token Expirty' };
      }
      const findUser = await this.users.findOne({
        where: { username: payload.checklistuser },
        attributes: {
          exclude: [
            'username',
            'id_member',
            'password',
            'code',
            'status',
            'createdAt',
          ],
        },
      });
      if (!findUser) throw { message: `ไม่พบ User นี้ในระบบลอง Login ใหม่` };
      let update = moment(findUser.updatedAt).valueOf();
      if (!bcrypt.compareSync(`${update}`, payload.upa))
        throw { message: 'User Updated Login ใหม่อีกครั้ง' };
      return { ...findUser, username: payload.checklistuser };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
