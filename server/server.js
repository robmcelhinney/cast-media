#!/usr/bin/env node

// import myConstClass from './src/constants/constants.js'

import path from 'path'
import fs from 'fs'
import util from 'util'
import Fastify from 'fastify'
import ChromecastAPI from 'chromecast-api'
import os from 'os'
import fileUpload from 'fastify-file-upload'
import fastifyStatic from '@fastify/static'

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        }
    }
})
fastify.register(fileUpload)

const __dirname = path.resolve();
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../client/build"),
    prefix: '/', // optional: default '/'
})

export default ({ base_path, port }) => {
    const client = new ChromecastAPI()
    let SELECT_CAST_DEVICE = ""

    let ADDRESS,
    ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? ADDRESS = details.address: undefined);
    }

    // Declare a route
    // fastify.get('/', async (req, _res) => {
    //     req.log.info('Sending hello world')
    //     return { hello: 'world' }
    // })

    const readdir = util.promisify(fs.readdir)

    const base_dir = base_path || process.cwd()

    fastify.get('/api/files', async (req, res) => {
        let dir
        if (req.query.path && req.query.path !== "undefined") {
            dir = path.join(base_dir, req.query.path)
        } else {
            dir = base_dir
        }
        if (!checkPathOK(dir)) {
            req.log.error('Cannot find files from dir: %s', dir)
            return res.code(403).send("Can't go back up path")
        }
        try {
            let files = await listDir(dir)
            req.log.info('Sending list of files from dir: %s', dir)
            return res.code(200).header('Content-Type', 'application/json; charset=utf-8').send(files)
        } catch (err) {
            req.log.error('Cannot find files from dir: : %s.', dir)
            return res.code(501).send("Can't browse files")
        }
    })

    async function listDir(dir) {
        let jsonResult = {}
        let rel_dir = ""
        let files

        try {
            files = await readdir(dir)
        } catch (err) {
            console.error(err)
        }
        files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        files.forEach((file) => {
            jsonResult[file] = path.join(rel_dir, file)
            let is_dir = false

            // Is directory?
            let file_path = path.join(dir, file)
            if (
                fs.existsSync(file_path) &&
                fs.lstatSync(file_path).isDirectory()
            ) {
                is_dir = true
            }

            jsonResult[file] = is_dir
        })
        return jsonResult
    }

    function checkPathOK(path_check) {
        return !path_check.includes("..")
    }
    
    fastify.get('/api/stream/:file', (req, res) => {
        const file = req.params.file
        req.log.info('Sending file: %s', file)
        fs.readFile(base_path + file, (err, fileBuffer) => {
            res.send(err || fileBuffer)
        })
    })

    fastify.get('/api/baseDir', (req, res) => {
        req.log.info('Sending base_dir: %s', base_dir)
        res.send(base_dir)
    })

    fastify.get('/api/cast/:file', (req, res) => {
        if (SELECT_CAST_DEVICE.length == 0) {
            return res.code(404).send({"error":"Device not selected"})
        }
        let file = req.params.file
        var mediaURL = 'http://' + ADDRESS + ':' + port + '/api/stream/' + file
        playURL(mediaURL, req, res)
    })

    const playURL = (url, req, res) => {
        let selectedDevice = client.devices.find(device => device.friendlyName === SELECT_CAST_DEVICE)
        req.log.info('Casting url to Selected Device {%s} with URL: {%s}', selectedDevice, url)
        selectedDevice.play(url, (err) => {
            if (!err) {
                req.log.info('Playing on your chromecast')
                return res.code(200)
            }
            else {
                return res.code(500)
            }
        })

        selectedDevice.on('finished', (err) => {
            if (!err) {
                selectedDevice.close((err) => {
                    if (!err) {
                        req.log.info('Playing on your chromecast')
                        return res.code(200)
                    }
                    else {
                        req.log.error('Error closing device: %s', err)
                    }
                })
                req.log.info('Playing on your chromecast')
                return res.code(200)
            }
            else {
                req.log.error('Error finishing device: %s', err)
            }
        })
    }
    
    fastify.get('/api/castDevices', async  (req, res) => {
        client.update()
        req.log.info('Client Devices: %s', client.devices)
        return res.code(200).send(client.devices)
    })

    fastify.get('/api/castDevice/:castDevice', async  (req, res) => {
        SELECT_CAST_DEVICE = req.params.castDevice
        req.log.info('Set Cast Device: %s', SELECT_CAST_DEVICE)
        return res.code(200)
    })

    // Run the server!
    const start = async () => {
        try {
            await fastify.listen({ port: port, host: '0.0.0.0' })
        } catch (err) {
            fastify.log.error(err)
            process.exit(1)
        }
    }
    start()


    fastify.post('/api/upload', async  (req, _) => {
        const data = await req.body

        fs.writeFile("./public/recording.wav", Buffer.from(new Uint8Array(data.file.data)), function (err) {
            if (err) return console.log(err);
            console.log('save file');
        });

    })
}
