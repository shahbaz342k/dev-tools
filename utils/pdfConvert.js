const path = require('path');
const fs = require('fs').promises;
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

// Current file's directory
const currentDir = __dirname;
// Navigate backward to the parent directory
const rootDir = path.join(currentDir, '..');
// const inputPath = path.join(rootDir, '/' + 'uploads/1723321498968-141037750Naukri_MOHDSHAHBAZ[5y_0m]-exp.docx');
// console.log(inputPath)
// return;
const generateRandomStringWithChars = require('./generateRandomString')
const pdfConvert = async (file) => {
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
module.exports = pdfConvert;