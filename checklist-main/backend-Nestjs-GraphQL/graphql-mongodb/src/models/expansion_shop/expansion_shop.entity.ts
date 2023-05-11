import { Table, Column, DataType, AutoIncrement, AllowNull, Default, PrimaryKey, Model } from 'sequelize-typescript';

@Table({ tableName: "expansions", modelName: "expansions", freezeTableName: true, timestamps: true })
export class expansions extends Model {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(true)
    @Column({ type: DataType.INTEGER })
    id_expansion: number;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255) })
    ID: string;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255) })
    NAME: string;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255) })
    BU: string;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255) })
    am_location: number;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255) })
    rm_location: string;

    @Default("1")
    @Column({ type: DataType.ENUM("0", "1") })
    STATUS: "0" | "1";

    @Column({ type: DataType.STRING(255) })
    bm_location: string;

}