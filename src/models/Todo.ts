import {
    Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, DataType,
} from "sequelize-typescript";
import { User } from "./User";


export interface TodoModel {
    id:number,
    content:string,
    date:string,
    complete:string,
    userId: number,
    creationDate: Date,
    updatedOn: Date
}

enum TodoStatus {
    Completed = "C",
    Active = "Y",
}

@Table
export class Todo extends Model<Todo> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({ allowNull: false, type: DataType.STRING })
    content: string;

    @Column({ allowNull: false, type: DataType.STRING })
    date: string;

    @Column({ allowNull: false, type: DataType.STRING })
    complete: TodoStatus;

    @ForeignKey(() => User)
    @Column({ allowNull: false, type: DataType.INTEGER })
    userId!: number;

    @CreatedAt
    @Column(DataType.DATE)
    creationDate: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedOn: Date;
}
