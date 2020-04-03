import TodoStatus from "./enum";


export interface signup {
    email: string,
    nickname: string,
    password: string
}

export interface login {
    email: string,
    password: string
}

export interface addtodo{
    content: string,
    date: string,
    complete: string
}

export interface updatetodo {
    id: number,
    complete: TodoStatus
}
