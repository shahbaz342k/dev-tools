
const { DownloaderHelper } = require('node-downloader-helper');

// URL of the image
const file = 'example_OhhyKAdVV5.pdf';
// Path at which image will be downloaded
const filePath = `${__dirname}/uploads`; 

const dl = new DownloaderHelper(file , filePath);

dl.on('end', () => console.log('Download Completed'))
dl.start();

