import dotenv from 'dotenv';
dotenv.config();

export const variables = {
    isProduction: process.env.NODE_ENV === 'production',
    postgres: {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    },
    jwt: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.API_JWT_SECRET,
        maxAge: process.env.API_COOKIE_MAX_AGE
    },
    api: {
        port: process.env.API_PORT,
    },
    client: {
        domain: process.env.CLIENT_DOMAIN,
        port: process.env.CLIENT_PORT
    }
};