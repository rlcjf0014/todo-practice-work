import {
    Model, Column, Table, HasMany, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, DataType,
} from "sequelize-typescript";
import { Todo } from "./Todo";

export interface UserModel {
    userid:number,
    email:string,
    password:string,
    nickname:string,
    salt?: string,
    refreshToken?: string,
    creationDate: Date,
    updatedOn:Date
}

@Table
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    userid: number;

    @Column({ allowNull: false, type: DataType.STRING })
    email: string;

    @Column({ allowNull: false, type: DataType.STRING })
    password: string;

    @Column({ allowNull: false, type: DataType.STRING })
    nickname: string;

    @Column(DataType.STRING)
    salt?: string;

    @Column(DataType.STRING)
    refreshToken?: string;

    @HasMany(() => Todo)
    todos: Todo[];

    @CreatedAt
    @Column(DataType.DATE)
    creationDate: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedOn: Date;
}
