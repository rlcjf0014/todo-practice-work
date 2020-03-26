import {
  Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';

export interface TodoModel {
    id:number,
    content:string,
    date:string,
    complete:string,
    userId: number,
    creationDate: Date,
    updatedOn: Date
}

@Table
export class Todo extends Model<Todo> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({ allowNull: false })
    content: string;

    @Column({ allowNull: false })
    date: string;

    @Column({ allowNull: false })
    complete: string;

    @ForeignKey(() => User)
    @Column({ allowNull: false })
    userId!: number;

    @CreatedAt
    @Column
    creationDate: Date;

    @UpdatedAt
    @Column
    updatedOn: Date;
}
