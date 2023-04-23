import debug from 'debug';

/**
 * Logs to console / stdout
 * @param namespace 
 * @returns instance of Debug
 */
export const createLogger = (namespace:string):debug.Debugger => {
    const dbg = debug(namespace);

    const rx = /nodemon/gi;
    
    if(rx.test(process.env?.npm_lifecycle_script ?? "")) {
        // When started via nodemon:
        // forcing the use of console insted of stdout
        // -> nodemon doesn't work with stdout
        dbg.log = console.log.bind(console);
    }

    return(dbg);
};