import {getTodos, newTodos, updateTodos, completedTodos, deleteTodos} from "../services/todoservice"


export const todoHandler = {
    retrieveList: () => getTodos(),
    create: ({body}: any) => newTodos(body.title),
    update: ({params, body}: any) => {
        console.log("Update - ID:", params.id, "New Title:", body.title);
        return updateTodos(Number(params.id), body.title);
    },
    complete: ({params}: any) => completedTodos(Number(params.id)),
    delete: ({params}: any) => deleteTodos(Number(params.id))
}