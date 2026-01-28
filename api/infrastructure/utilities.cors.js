import cors from 'cors';

const clientDomain = process.env.CLIENT_DOMAIN;
const clientPort = process.env.CLIENT_PORT;

const allowedOrigins = [
    `http://${clientDomain}:${clientPort}`,
    `https://${clientDomain}:${clientPort}`,
];

if (clientPort === '80') {
    allowedOrigins.push(`http://${clientDomain}`);
    allowedOrigins.push(`https://${clientDomain}`);
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsSettings;