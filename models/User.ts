import {Model, Column, Table, HasMany, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement} from "sequelize-typescript";
import {Todo} from "./Todo";

@Table
export class User extends Model<User> {
    
    @PrimaryKey
    @AutoIncrement
    @Column
    userid: number;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    nickname: string;

    @Column
    salt: string;

    @Column
    refreshToken?: string;
    
    @HasMany(() => Todo)
    todos: Todo[];

    @CreatedAt
    @Column
    creationDate: Date;

    @UpdatedAt
    @Column
    updatedOn: Date;


}
