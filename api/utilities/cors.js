import cors from 'cors';
import { variables } from './variables.js';

const allowedOrigins = [
    `http://${variables.client.domain}:${variables.client.port}`,
    `https://${variables.client.domain}:${variables.client.port}`,
];

if (variables.client.port === '80') {
    allowedOrigins.push(`http://${variables.client.domain}`);
    allowedOrigins.push(`https://${variables.client.domain}`);
}

const corsSettings = cors({
    origin: function (origin, callback) {

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error(`CORS blocked origin: ${origin}`)
        );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsSettings;