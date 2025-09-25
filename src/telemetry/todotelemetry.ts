import { Elysia } from "elysia"
import { opentelemetry } from "@elysiajs/opentelemetry"
import {trace, metrics} from "@opentelemetry/api"
import {db} from "../models/db"  

const meter = metrics.getMeter('todo-api', '1.0.0')
//RED metrics
const httpRequests = meter.createCounter('requests_total')
const httpErrors = meter.createCounter('errorsTotal')
const httpDuration = meter.createHistogram('requestDurations')
let totalRequests= 0
let startTime = Date.now()
export const metricMiddleware = (app: Elysia) => {
    return app
        .onBeforeHandle((context: any) => {
            // Request arrives and the timer starts
            context.startTime = Date.now();
        
        })

            //if request is succesffull
        .onAfterHandle((context: any) => {
            const duration = Date.now() - context.startTime; // calculate the duraction of request time
            
            totalRequests++

            const uptimeSecs = (Date.now() - startTime) / 1000 
            const requestRate = (totalRequests / uptimeSecs)
            // Increment a successful request made from the method and path/route
            httpRequests.add(1, {
                method: context.request.method,
                route: context.path
            });
            
            // Record down how long it took 
            httpDuration.record(duration, {
                method: context.request.method,
                route: context.path
            });
            
            console.log(`METRICS: ${context.request.method}
                 ${context.path} - ${duration}ms
                  | Total: ${totalRequests}
                   | Rate: ${requestRate} req/sec`);

        }) //if there is an error (400 error usually), this executes
        .onError((context: any) => {
            // calculate duration if error happens
            const duration = Date.now() - context.startTime;
            
            // Record the error in variable
            httpErrors.add(1, {
                method: context.request.method,
                route: context.path
            });
            
            // Still records duration even for errors (label it as an error )
            httpDuration.record(duration, {
                method: context.request.method,
                route: context.path,
                status: 'error'
            });

            console.log(` ERROR: ${context.request.method} ${context.path} - ${duration}ms`);


            
        });
};

// System Health
export const healthCheck = async () => { // async means function is waiitng for information
    try { 
        // Test database connection
        await db.select().from(require('../models/schema').todos).limit(1); // wait for database operation to complete
        return { //return the health status
            status: 'healthy', 
            timestamp: new Date().toISOString(), 
            uptime: process.uptime() // how long the server has been running for
        };
    } catch (error) { // if there is an error, then you know that the status is unhealthy
        return { 
            status: 'unhealthy', 
            error: 'Database connection failed', //label this as an error
            timestamp: new Date().toISOString() 
        };
    }
};

