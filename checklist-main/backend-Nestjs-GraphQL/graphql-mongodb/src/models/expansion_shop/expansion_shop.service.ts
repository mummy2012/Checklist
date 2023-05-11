import { Injectable, Inject } from '@nestjs/common';
import { WhereOptions, FindAttributeOptions, Order  } from 'sequelize';
import { expansions } from './expansion_shop.entity';

@Injectable()
export class expansionsService {
    constructor(
        @Inject('expansions_REPOSITORY')
        private expansionsRepository: typeof expansions
    ) { }

    async findOne({ where, attributes, order }: { where: WhereOptions<expansions>, attributes?: FindAttributeOptions, order?: Order }): Promise<expansions | null> {
        try {
            const find = await this.expansionsRepository.findOne<expansions>({ raw: true, where, attributes, order });
            return find
        } catch (error) {
            throw error
        }
    }
    async findAll({ where, attributes, order , limit , offset , group }: { where: WhereOptions<expansions>, attributes?: FindAttributeOptions, order?: Order , limit?:number , offset?:number ,group ?: string }): Promise<expansions[]> {
        try {
            const find = await this.expansionsRepository.findAll<expansions>({ raw: true, where, attributes, order , limit , offset , group });
            return find
        } catch (error) {
            throw error
        }
    }

}