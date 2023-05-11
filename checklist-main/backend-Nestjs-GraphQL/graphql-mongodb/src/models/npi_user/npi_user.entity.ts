import { Table, Column, DataType, AutoIncrement, AllowNull, Default, PrimaryKey, Model } from 'sequelize-typescript';

@Table({ tableName: "user", modelName: "user", freezeTableName: true, timestamps: true })
export class User extends Model {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    id_member: number;

    @AllowNull(false)
    @Column({ type: DataType.STRING(255) })
    username: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(255) })
    password: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(255) })
    fullname: string;

    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    location_id: number;

    @AllowNull(false)
    // @Column({ type: DataType.ENUM("BM", "AM" ,"RM" ,"Admin") })
    @Column({ type: DataType.STRING })
    role: string;

    @Default("1")
    @Column({ type: DataType.ENUM("0", "1") })
    status: "0" | "1";

    @Column({ type: DataType.STRING(6) })
    code: string;

}