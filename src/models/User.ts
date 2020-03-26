import {
  Model, Column, Table, HasMany, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement,
} from 'sequelize-typescript';
import { Todo } from './Todo';

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
    @Column
    userid: number;

    @Column({ allowNull: false })
    email: string;

    @Column({ allowNull: false })
    password: string;

    @Column({ allowNull: false })
    nickname: string;

    @Column
    salt?: string;

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
