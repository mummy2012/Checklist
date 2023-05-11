import { Injectable, Inject } from '@nestjs/common';
import { WhereOptions, FindAttributeOptions, Order } from 'sequelize';
import { users } from './users.entity';

@Injectable()
export class usersService {
    constructor(
        @Inject('expansions_REPOSITORY')
        private expansionsRepository: typeof users
    ) { }

    async findOne({ where, attributes, order }: { where: WhereOptions<users>, attributes?: FindAttributeOptions, order?: Order }): Promise<users | null> {
        try {
            const find = await this.expansionsRepository.findOne<users>({ raw: true, where, attributes, order });
            return find
        } catch (error) {
            console.log('====================================');
            console.log(error,"error here");
            console.log('====================================');
            throw error
        }
    }
    async findAll({ where, attributes, order }: { where: WhereOptions<users>, attributes?: FindAttributeOptions, order?: Order }): Promise<users[]> {
        try {
            const find = await this.expansionsRepository.findAll<users>({ raw: true, where, attributes, order });
            return find
        } catch (error) {
            throw error
        }
    }

}