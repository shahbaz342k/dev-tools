
// const { DownloaderHelper } = require('node-downloader-helper');

// // URL of the image
// const file = 'example_FXBAVNP3jD.pdf';
// // Path at which image will be downloaded
// const filePath = `${__dirname}/uploads`; 

// const dl = new DownloaderHelper(file , filePath);

// dl.on('end', () => console.log('Download Completed'))
// dl.start();


// const http = require('http'); // or 'https' for https:// URLs
// const fs = require('fs');

// const file = fs.createWriteStream("uploads/example_FXBAVNP3jD.pdf");
// const request = http.get("http://localhost:5001/uploads/example_FXBAVNP3jD.pdf", function(response) {
//    response.pipe(file);

//    // after download completed close filestream
//    file.on("finish", () => {
//        file.close();
//        console.log("Download Completed");
//    });
// });

const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle file download
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
//   const filePath = path.join(__dirname, 'public', filename);
  const filePath = path.join(__dirname, `uploads/${filename}`);

  // Check if file exists
  res.download(filePath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

