import { Sequelize } from 'sequelize-typescript';
import { expansions } from 'src/models/expansion_shop/expansion_shop.entity';
import { bus } from 'src/models/bus/bus.entity';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: process.env.EXPANSION_HOST,
                port: process.env.EXPANSION_PORT as unknown as number,
                username: process.env.EXPANSION_USERNAME,
                password: process.env.EXPANSION_PASSWORD,
                database: process.env.EXPANSION_DATABASE,
                define: {
                    timestamps: true,
                    freezeTableName: true,
                    charset: "utf8mb4",
                    collate: "utf8mb4_unicode_ci",
                },
                pool: {
                    max: 120,
                    min: 0,
                    acquire: 400000,
                    idle: 10000,
                },
                logQueryParameters: true,
                dialectOptions: {
                    dateStrings: false,
                    connectTimeout: 300000,
                    typeCast: (field, next) => {
                        if (field.type === "DATETIME") {
                            return field.string();
                        }
                        return next();
                    },
                },
                logging: (sql) => {
                  if(process.env.NODE_ENV == "development"){ 
                    console.log('npidb', sql);
                  }
                },
                timezone: "+07:00",
            });
            sequelize.addModels([expansions,bus]);
            await sequelize.sync()
            return sequelize;
        },
    },
];