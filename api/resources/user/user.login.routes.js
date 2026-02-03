import express from 'express';
import { variables } from '../../utilities/variables.js';
import { login } from '../../utilities/authentication.js';
import { getUser } from './user.repository.js';

const router = express.Router();

router.post('/login', async(req, res) => {
    try{
        const { token } = req.body;

        if(!token){
            return res.status(400).json({ message: 'No token provided' });
        }

        const result = await login(token);
        if(!result.success){
            console.error(result.message);
            return res.status(400).json({ message: result.message });
        }

        const user = await getUser(result.userId);
        if(!user){
            console.error(`Could not find user with id ${result.userId}`);
            return res.status(500);
        }

        res.cookie(
        'apptrack_auth',
        result.jwtToken,
        {
            httpOnly: true,
            secure: variables.isProduction,
            sameSite: 'lax',
            maxAge: variables.jwt.maxAge * 24 * 60 * 60 * 1000
        });

        return res.json(user);
    }catch(e){
        console.error(e);
        return res.status(500);
    }
})

export default router;