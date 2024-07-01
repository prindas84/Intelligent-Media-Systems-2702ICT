// Initialise the session access token as null to evaluate if the user is logged in.
let accessToken = null;

// Function to set the access token once a user has logged into the Spotify API.
const setAccessToken = (token) => {
    accessToken = token;
};

// Function to get the access token stored in the session.
const getAccessToken = () => {
    return accessToken;
};

// Function to reset the access token stored in the session.
const removeAccessToken = () => {
    accessToken = null;
};

// Function to check if the access token is still valid or has timed out.
const checkTokenValidity = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.ok;
};

// Function to initialise the app. Check the access token, check it is valid, or get it from the URL to store in session.
const initialiseApp = async () => {
    if (getAccessToken() !== null) {
        const isValid = await checkTokenValidity(getAccessToken());
        if (!isValid) {
            removeAccessToken();
        }
    }

    if (getAccessToken() === null) {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const token = urlParams.get('access_token');
        if (token) {
            setAccessToken(token);
            window.history.pushState({}, document.title, window.location.pathname);
        }
    }
};

export { setAccessToken, getAccessToken, removeAccessToken, checkTokenValidity, initialiseApp };