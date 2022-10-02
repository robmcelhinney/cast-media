#!/usr/bin/env node

import server from "./server.js"
import meow from "meow"
import myConstClass from './src/constants/constants.js'

const cli = meow(`
    Usage
      $ cast-media
 
    Options
        --path, -p  Run in given directory
        --port, -o  Port to listen on
 
`, {
    boolean: ["help", "version"],
    alias: { h: "help", v: "version" },
	importMeta: import.meta,
    flags: {
        path: {
            type: "string",
            default: "public/",
            alias: "p"
        },
        port: {
            type: "number",
            default: myConstClass.PORT,
            alias: "o"
        },
    }
})

let path = cli.flags.path != "" ? cli.flags.path : undefined
if (!path.endsWith('/')) {
    path = path + '/'
}
const port = Number.isInteger(cli.flags.port) ? 
        cli.flags.port : undefined

if (port == undefined || (port > 65535  || (port <= 1023))) {
    console.log("Port must be a number between 1024 - 65535.")
    quit()
}

server({
    base_path: path,
    port: port
})