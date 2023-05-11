import { Injectable, Inject } from '@nestjs/common';
import { WhereOptions, FindAttributeOptions, Order } from 'sequelize';
import { User } from './npi_user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User
    ) { }

    async findOne({ where, attributes, order }: { where: WhereOptions<User>, attributes?: FindAttributeOptions, order?: Order }): Promise<User | null> {
        try {
            const find = await this.usersRepository.findOne<User>({ raw: true, where, attributes, order });
            return find
        } catch (error) {
            throw error
        }
    }
    async findAll({ where, attributes, order }: { where: WhereOptions<User>, attributes?: FindAttributeOptions, order?: Order }): Promise<User[]> {
        try {
            const find = await this.usersRepository.findAll<User>({ raw: true, where, attributes, order });
            return find
        } catch (error) {
            throw error
        }
    }

}