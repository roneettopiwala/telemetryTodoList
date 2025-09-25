import {getTodos, newTodos, updateTodos, completedTodos, deleteTodos} from "../services/todoservice"
import { trackTodoCompleted, trackTodoCreated, trackTodoDeleted, trackTodoViewed } from "../telemetry/todotelemetry";


export const todoHandler = {
    retrieveList: () => {
        trackTodoViewed()
        return getTodos()
    },
    create: ({body}: any) => {
    trackTodoCreated()
    return newTodos(body.title)
    },
    update: ({params, body}: any) => {
        console.log("Update - ID:", params.id, "New Title:", body.title);
        return updateTodos(Number(params.id), body.title);
    },
    complete: ({params}: any) =>{
        trackTodoCompleted()
        return completedTodos(Number(params.id))
    },
    delete: ({params}: any) =>{
        trackTodoDeleted() 
        deleteTodos(Number(params.id))
    }
}