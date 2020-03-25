import {Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey} from "sequelize-typescript";
import {User} from "./User";

@Table
export class Todo extends Model<Todo> {
    
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    content: string;

    @Column
    date: string;

    @Column
    complete: string;

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @CreatedAt
    @Column
    creationDate: Date;

    @UpdatedAt
    @Column
    updatedOn: Date;

}