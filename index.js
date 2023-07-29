const express = require('express');
const cors = require('cors');
const app = express();
const whois = require('whois');

// Use cors middleware to allow cross-origin requests
app.use(cors());

// Middleware to check API key
app.use((req, res, next) => {
    const apiKey = req.get('X-API-KEY');
    if (!apiKey || apiKey !== '123456789') {
        return res.status(403).send('Forbidden: Invalid API Key.');
    }
    next();
});

app.get('/checkDomain', (req, res) => {
    const domain = req.query.domain;

    if (!domain) {
        return res.status(400).send('Bad Request: No domain specified.');
    }

    whois.lookup(domain, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error.');
        }

        const domainInfo = {
            domain: domain,
            data: data,
            available: false,
        };

        if (data.indexOf('No match found') !== -1 || data.indexOf('NOT FOUND') !== -1) {
            domainInfo.available = true;
        }

        return res.json(domainInfo);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
