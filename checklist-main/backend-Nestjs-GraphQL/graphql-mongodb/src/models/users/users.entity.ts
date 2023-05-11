import { Table, Column, DataType, AutoIncrement, AllowNull, Default, PrimaryKey, Model, NotEmpty } from 'sequelize-typescript';

@Table({ tableName: "users", modelName: "users", freezeTableName: true, timestamps: true })
export class users extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id_member: number;

    @AllowNull(false)
    @NotEmpty
    @Column({ type: DataType.STRING(255) })
    username: string;
    
    @AllowNull(false)
    @NotEmpty
    @Column({ type: DataType.STRING(255) })
    firstname: string;
    
    @AllowNull(false)
    @NotEmpty
    @Column({ type: DataType.STRING(255) })
    lastname: string;
    
    @Column({ type: DataType.STRING(255) })
    nickname: string;
}