import {Model, Column, Table, HasMany, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey} from "sequelize-typescript";
import {User} from "./user";

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
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;

}