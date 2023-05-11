import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService as UserModelService} from 'src/models/npi_user/npi_user.service';
import { User } from 'src/models/npi_user/npi_user.entity';
import { payload } from 'src/types/auth';
import moment from 'moment';
import bcrypt from "bcryptjs"
@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private users: UserModelService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    try {
      const findUser = await this.users.findOne({ attributes: ['username', 'status', 'password', 'updatedAt'], where: { username: username } })
      if (!findUser) throw { status: 404, message: "ไม่พบชื่อผู้ใช้งาน / รหัสผ่านไม่ถูกต้อง" }
      if (findUser.status == "0") throw { message: "ถูกระงับการใช้งานกรุณาติดต่อ Operation Standard" }
      if (!bcrypt.compareSync(password, findUser.password)) throw { message: "ไม่พบชื่อผู้ใช้งาน / รหัสผ่านไม่ถูกต้อง" }
      return findUser;
    } catch (error) {
      throw error
    }
  }

  async jwtCreate(user: User) {
    try {
      const payload: payload = {
        checklistuser: user.username,
        iat: moment().valueOf(),
        exp: moment().valueOf() + 604800000,
        upa: bcrypt.hashSync(`${moment(user.updatedAt).valueOf()}`, 10)
      };
      return this.jwtService.sign(payload, { secret: process.env.SESSION_SECRET })
    } catch (error) {
      throw error
    }
  }

  async checkDeatailuser(user:string){
    
  }
}
