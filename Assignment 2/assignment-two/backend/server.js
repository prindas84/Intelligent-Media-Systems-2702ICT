const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');

// Import environment variables for the server.
dotenv.config();
const proxyPort = process.env.PROXY_PORT;
const proxyServer = `${process.env.PROXY_SERVER_URL}:${proxyPort}`;
const allowedUrl = process.env.X_ORIGIN_ALLOW;

// Start the server with SSL credentials.
const serverOptions = {
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
};

const server = https.createServer(serverOptions, (req, res) => {
    // Set headers to give access to the app URL.
    res.setHeader('Access-Control-Allow-Origin', allowedUrl);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Split the URL to retrieve parameters.
    const parsedUrl = new URL(req.url, `https://${req.headers.host}`);

    // If the call is for the Spotify API.
    if (parsedUrl.searchParams.get('api') === 'login') {
        // Construct the Spotify authorization URL.
        const queryParams = new URLSearchParams({
            client_id: process.env.SPOTIFY_CLIENT_ID,
            response_type: 'token',
            redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
            scope: 'user-follow-read',
            show_dialog: 'true'
        });
        const authorizeUrl = `https://accounts.spotify.com/authorize?${queryParams}`;

        // Redirect the user to the Spotify authorization URL.
        res.writeHead(302, { 'Location': authorizeUrl });
        res.end();

        // Log to the server terminal for debugging.
        console.log("SPOTIFY LOGIN - PROCESSING");
    }

    // If the call is for the YouTube API.
    else if (parsedUrl.searchParams.get('api') === 'google') {
        // Retrieve the artist name passed to the server.
        const artist = parsedUrl.searchParams.get('artist');
        const googleAPI = process.env.GOOGLE_API_KEY;
        const searchQuery = `${artist} Live In Full Concert`;

        // Construct the YouTube search request URL.
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&type=video&key=${googleAPI}`;

        // Fetch the URL to retrieve the highest video by relevance, given the search term. Return it to the main app.
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Log to the server terminal for debugging.
                console.log("GOOGLE FETCH - PROCESSING");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data.items));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {
        // If the API endpoint is not found.
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('API endpoint not found');
    }
});

server.listen(proxyPort, () => {
    // Log that the server has started listening.
    console.log(`Server listening on ${proxyServer}`);
});
