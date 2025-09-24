import {Elysia, t} from 'elysia'
import { todoHandler } from '../handlers/todohandler'


export const todoRoute = (app: Elysia) => 
    app.get("/todos", todoHandler.retrieveList)
    .post('/todos', todoHandler.create)
    .patch('/todos/:id', todoHandler.update)
    .put('/todos/:id', todoHandler.complete)
    .delete("/todos/:id", todoHandler.delete)
    .get("/", () => "Welcome to Todo API!");