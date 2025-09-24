import {sqliteTable, integer, text} from "drizzle-orm/sqlite-core";


export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({autoIncrement: true}).notNull(),
    title: text("name").notNull(),
    completed: integer("completed").default(0).notNull(), // 0 = False, 1 True

});


