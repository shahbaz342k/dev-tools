require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const fsmod = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const upload = require('./utils/fileUpload');
// const main = require('./utils/pdfConvert');
app.use(express.json())
app.use(cors());
app.set("view engine", 'ejs');
app.set(express.static(path.join(__dirname, 'views')));

const fs = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

// Current file's directory
const currentDir = __dirname;
// Navigate backward to the parent directory
const rootDir = currentDir 
// path.join(currentDir, '..');
// const inputPath = path.join(rootDir, '/' + 'uploads/1723321498968-141037750Naukri_MOHDSHAHBAZ[5y_0m]-exp.docx');
// console.log(inputPath)
// return;
const generateRandomStringWithChars = require('./utils/generateRandomString')
const main = async (file) => {
    const ext = 'pdf'; // Output extension.
    const inputPath = path.join(rootDir, '/' + file);
    // const inputPath = path.join(__dirname,'myresume.docx');
    // const inputPath = path.join(__dirname, '/myresume.docx');
    console.log('input path ', inputPath);
    const customChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const fileName = `devTools_${generateRandomStringWithChars(10, customChars)}.${ext}`;
    const outputPath = path.join(rootDir, `uploads/${fileName}`);

    // Read the input file.
    const docxBuf = await fs.readFile(inputPath);
    // console.log(docxBuf);
    // console.log(docxBuf.toString());
    // Convert to PDF format with an undefined filter.
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
    await fs.writeFile(outputPath, pdfBuf);
    fs.unlink(inputPath);
    return fileName;
}
// module.exports = pdfConvert;


app.get('/', (req, res) => {
    res.render('fileuploadTemplate.ejs', { success: false, downloadFile: '' });
});

app.post('/savefile', upload.single('file'), async (req, res) => {


    if (!req.file) {
        return res.redirect('/')
    }

    let imagePath = req.file.path
    let description = req.body.description


    // Save this data to a database probably

    // console.log(description, imagePath);

    // imagePath = imagePath.replace('uploads/', '')
    // res.redirect('images/'+imagePath)
    const data = await main(imagePath).catch(function (err) {
        console.log(`Error converting file: ${err}`);
        res.render('fileuploadTemplate.ejs', { success: false, downloadFile: 'not uploaded' });

    });
    res.render('fileuploadTemplate.ejs', { success: true, downloadFile: data });
})

// app.get('/uploaded/:file', (req, res) => {
//     // do a bunch of if statements to make sure the user is 
//     // authorized to view this image, then

//     const file = req.params.file;
//     console.log(file);
//     const readStream = fsmod.createReadStream(`uploads/${file}`)
//     readStream.pipe(res)
// })

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, `uploads/${filename}`);

    // Check if file exists
    res.download(filePath, err => {
        if (err) {
            res.status(404).send('File not found');
        } else {

            setTimeout(() => {
                fsmod.unlink(filePath, unlinkErr => {
                    if (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    } else {
                        console.log('File deleted successfully after delay.');
                    }
                });
            }, 1000 * 10);
            console.log('file path22 ' + filePath);

        }
    });
});


app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
});