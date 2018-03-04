const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const {PORT, STATIC_IMAGE_DIRECTORY} = process.env;
const app = express();
app.use(morgan('combined'));
app.use(fileUpload());
app.use('/', express.static(STATIC_IMAGE_DIRECTORY));
app.put('/:filename', upload);
app.post('/:filename', upload);

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
    const filePath = path.join(STATIC_IMAGE_DIRECTORY, req.params.filename);
    console.log(`save file to "${filePath}"`);
    try {
        await file.mv(filePath);
        res.send('Files uploaded!');
    } catch (err) {
        res.status(500).send(`Error saving files ${err}`);
    }
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});
