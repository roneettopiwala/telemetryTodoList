import {db} from "../models/db"
import { todos } from "../models/schema";
import {eq} from "drizzle-orm";


// retrieve and GET all the listed todos
export const getTodos = () => db.select().from(todos).all()

//POST or create a new todo
export const newTodos = (title: string) => db.insert(todos).values({title}).returning().get()

//UPDATE the text/title
export const updateTodos = (id: number, newTitle: string) => db.update(todos).set({title: newTitle}).where(eq(todos.id, id)).returning().get();

//mark as complete
export const completedTodos = (id : number) => db.update(todos).set({completed : 1}).where(eq(todos.id, id)).returning().get();

//delete the todo
export const deleteTodos = (id: number) => db.delete(todos).where(eq(todos.id, id)).run();


