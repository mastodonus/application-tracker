import express from 'express';
import dotnev from 'dotenv';
import cors from './infrastructure/utilities.cors.js';
import applicationRoutes from './resources/application/application.routes.js';
import documentRoutes from './resources/document/document.routes.js';
import interviewRoutes from './resources/interview/interview.routes.js';

try {
    dotnev.config();

    const app = express();
    const port = process.env.API_PORT || 5333;

    app.use(cors);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/applications', applicationRoutes)
    app.use('/api/documents', documentRoutes)
    app.use('/api/interviews', interviewRoutes)

    app.listen(port, () => {console.log(`Server started on port ${port}`)})
}
catch (err) {
    console.error('Fatal error in server initialization:', err);
    process.exit(1);
}