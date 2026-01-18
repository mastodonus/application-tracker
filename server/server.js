
try {
    require('dotenv').config();

    const express = require('express');
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/applications', require('./resources/application/application.routes'))
    app.use('/api/documents', require('./resources/document/document.routes'))
    app.use('/api/interviews', require('./resources/interview/interview.routes'))

    app.listen(5333, () => {console.log('Server started on port 5333')})
}
catch (err) {
    console.error('Fatal error in server initialization:', err);
    process.exit(1);
}