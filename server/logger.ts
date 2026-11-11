import type { Request } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.json(),
        }),
    ],
});

const prefix = (req: Request) => {
    return `${req.method} - ${req.originalUrl}`;
};

const utledMetadata = (req: Request, error?: any) => {
    const callId = req.header('nav-call-id');
    const requestId = req.header('x-request-id');

    return {
        ...(callId ? { x_callId: callId } : {}),
        ...(requestId ? { x_requestId: requestId } : {}),
        ...(error ? { error: error } : {}),
    };
};

export const logInfo = (message: string, req: Request) => {
    const melding = `${prefix(req)}: ${message}`;
    const meta = utledMetadata(req);

    logger.info(melding, meta);
};

export const logWarn = (message: string, req: Request, error?: any) => {
    const melding = `${prefix(req)}: ${message}`;
    const meta = utledMetadata(req, error);

    logger.warn(melding, meta);
};

export default logger;
