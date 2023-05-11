import { Injectable, Inject } from '@nestjs/common';
import { WhereOptions, FindAttributeOptions, Order } from 'sequelize';
import { bus } from './bus.entity';

@Injectable()
export class busService {
    constructor(
        @Inject('bus_REPOSITORY')
        private expansionsRepository: typeof bus
    ) { }

    async findOne({ where, attributes, order }: { where: WhereOptions<bus>, attributes?: FindAttributeOptions, order?: Order }): Promise<bus | null> {
        try {
            const find = await this.expansionsRepository.findOne<bus>({ raw: true, where, attributes, order });
            return find
        } catch (error) {
            console.log('====================================');
            console.log(error,"error here");
            console.log('====================================');
            throw error
        }
    }
    async findAll({ where, attributes, order }: { where: WhereOptions<bus>, attributes?: FindAttributeOptions, order?: Order }): Promise<bus[]> {
        try {
            const find = await this.expansionsRepository.findAll<bus>({ raw: true, where, attributes, order   });
            return find
        } catch (error) {
            throw error
        }
    }

}