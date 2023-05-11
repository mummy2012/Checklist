import { Table, Column, DataType, AutoIncrement, AllowNull, Default, PrimaryKey, Model, NotEmpty } from 'sequelize-typescript';

@Table({ tableName: "bus", modelName: "bus", freezeTableName: true, timestamps: true })
export class bus extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id_bu: number;

    @AllowNull(false)
    @NotEmpty
    @Column({ type: DataType.STRING(255) })
    bu_name: string;

}