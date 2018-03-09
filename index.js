const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const {PORT, STATIC_FILE_DIRECTORY} = process.env;
const app = express();
app.use(morgan('combined'));
app.use(fileUpload());
app.use('/', express.static(STATIC_FILE_DIRECTORY));
app.put('/:filename', upload);
app.post('/:filename', upload);
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
    // https://joseoncode.com/2014/07/21/graceful-shutdown-in-node-dot-js/
    process.on('SIGTERM', async function shutdownGracefully() {
        try {
            console.log('shutdown server gracefully');
            await server.close();
            console.log('graceful shutdown done');
        } catch (err) {
            console.error('Unexpected error during graceful shutdown', err);
        }
        process.exit(0);
    });
});

async function upload(req, res) {
    if (!req.params.filename) {
        console.log('Missing filename in route');
        return res.status(400).send('Missing filename in route')
    }
    if (!req.files) {
        console.log('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
    }
    const files = Object.values(req.files);
    if (files.length !== 1) {
        console.log('Only one file can be uploaded.');
        return res.status(400).send('Only one file can be uploaded.');
    }
    const file = files[0];
    const filePath = path.join(STATIC_FILE_DIRECTORY, req.params.filename);
    console.log(`save file to "${filePath}"`);
    try {
        await file.mv(filePath);
        console.log(`file saved: "${filePath}"`);
        res.send('Files uploaded!');
    } catch (err) {
        console.log(`Error saving files ${err}`);
        res.status(500).send(`Error saving files ${err}`);
    }
}
