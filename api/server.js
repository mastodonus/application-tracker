import express from 'express';
import cookieParser from 'cookie-parser';
import cors from './utilities/cors.js';
import applicationRoutes from './resources/application/application.routes.js';
import documentRoutes from './resources/document/document.routes.js';
import interviewRoutes from './resources/interview/interview.routes.js';
import userRoutes from './resources/user/user.login.routes.js';
import { variables } from './utilities/variables.js';

try {
    const app = express();

    app.use(cors);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use('/api/applications', applicationRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/interviews', interviewRoutes);
    app.use('/api/user', userRoutes);

    app.listen(variables.api.port, () => {
        console.log(`>> Server started on port ${variables.api.port}`)
    });
}
catch (err) {
    console.error('Fatal error in server initialization:', err);
    process.exit(1);
}