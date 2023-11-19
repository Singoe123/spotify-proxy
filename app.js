import('node-fetch').then((nodeFetch) => {
    const fetch = nodeFetch.default;
    const cheerio = require('cheerio');
    const express = require('express');
    const cors = require('cors');
    const axios = require('axios');

    const app = express();
    const PORT = 3000;

    app.use(cors());

    app.get('/spotify-proxy/:url', async (req, res) => {
        const spotifyUrl = req.params.url;
        console.log('Received URL:', spotifyUrl);
        
        try {
            let response = await fetch(spotifyUrl);
            const html = await response.text();
            const $ = cheerio.load(html);
            const linkElement = $('link[rel="alternate"][type="application/json+oembed"]');
            const hrefValue = linkElement.attr('href');
            console.log(hrefValue);
            response = await axios.get(hrefValue);
            console.log(response.data);
            res.send({ html: response.data.html });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running`);
    });
});
