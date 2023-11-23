const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

app.use(express.static(path.join(__dirname + "/public")))
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    // Add any additional security checks here if needed

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const contentType = imageResponse.headers['content-type'];
    if (!contentType) {
      console.error('Error: Content type header is missing in the image response.');
      res.status(500).send('Internal Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
    });

    res.end(Buffer.from(imageResponse.data, 'binary'));
  } catch (error) {
    console.error('Error proxying image:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});