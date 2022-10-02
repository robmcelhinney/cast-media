import * as winston from 'winston'
import * as setimmediate from 'setimmediate'

export const Logger = () => {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
          new winston.transports.Console(),
        ],
    })

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }))
    }
    return logger
}
  