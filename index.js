const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const {PORT, STATIC_IMAGE_DIRECTORY} = process.env;
const app = express();
app.use(morgan('combined'));
app.use(fileUpload());
app.use('/', express.static(STATIC_IMAGE_DIRECTORY));
app.post('/', async function (req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    try {
        await Promise.all(
            Object.values(req.files).map(file => {
                const filePath = path.join(STATIC_IMAGE_DIRECTORY, file.name);
                console.log(`save file to "${filePath}"`);
                return file.mv(filePath);
            })
        );
        res.send('Files uploaded!');
    } catch (err) {
        return res.status(500).send(`Error saving files ${err}`);
    }
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});
