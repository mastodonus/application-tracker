import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { upsertUser, getUser } from '../resources/user/user.repository.js';
import { variables } from './variables.js';

const client = new OAuth2Client(variables.jwt.clientId);

export async function login(token){
    try {
        if(!token){
            return { 
                success: false,
                message: 'authentication failed. token null'
            };
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: variables.jwt.clientId
        });

        const payload = ticket.getPayload();

        var userId = await upsertUser(payload.sub, {
            email: payload.email,
            name: payload.name,
            avatar: payload.picture
        });

        const user = await getUser(userId);

        const jwtToken = jwt.sign(
            { 
                userId, 
                user 
            },
            variables.jwt.secret, 
            { 
                expiresIn: `${variables.jwt.maxAge}d` 
            });

        return {
            success: true,
            jwtToken,
            userId
        }
    }catch(e){
        return { 
            success: false,
            message: e
        };
    }
}