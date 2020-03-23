# Purpose

Create server to operate a simple todolist application for web. 

# Stack
- mariaDB
- typescript
- typescript-rest
- sequelize
- jwt

# Function 
- Sign Up
- Login
- Logout
- Choose Date
- Input todo list
- Complete todo list
- Delete todo list
- Organize todo list by date

# Schema
https://www.erdcloud.com/d/5eLdfPncoeKkJkqK7

# API

## Sign Up

**POST** /user/new
- This endpoint allows the user to sign up. 

Body: {
    email: "hello@gmail.com",
    nickname: "David",
    password: "apache123"
}

Response (201): {
    message: "User is created."
}

## Login

**POST** /user
- This enpoint allows the user to login.

Body: {
    email: "hello@gmail.com",
    password: "apache123"
}

Response (200) : {
    message: "User is now logged in."
}

## Logout

**PUT** /user/token
- This endpoint deletes the user's refresh token. 

Body: {
    id: 1
}

Response (200): {
    message: "Successfully deleted refresh token."
}

## Add todo list

**POST** /todo
- This entpoint adds a new todo list. 

Body: {
    contents: "Take out trash",
    date: "2020-03-24",
    userid: 3    
}

Response (201): {
    contents: "Take out trash",
    date: "2020-03-24",
    completestatus: "Y",
    todoid: 1
}

## Update todo list

**PUT** /todo
- This endpoint updates the status of a todo list.

Body: {
    todoid: 1,
    completestatus: "C"
}

Response (201): {
    todoid: 1,
    completestatus: "C"
}

## Delete todo list

**DELETE** /todo/:todoid
- This endpoint deletes the status of a todo list. 

Response (200): {
    message: "Successfully deleted todo list,"
}

## Get todo list

**GET** /todo/:date
- This endpoint gets all the todo lists by the given date. 

Response (200): [
    {
        todoid: 1,
        contents: "Do the dishes",
        completestatus: "Y",
    },
    {
        todoid: 2,
        contents: "Exercise",
        completestatus: "C",
    },
    ...
]

## Renew Access Token

**GET** /user/:userid/token
- This endpoint gives the user new access token based on the refresh token.

Response (200): {
    message: "Sucessfully received new access token."
}


