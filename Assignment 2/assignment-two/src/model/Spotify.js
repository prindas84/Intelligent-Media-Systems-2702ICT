import React from 'react';
import LoginButton from '../view/Login';

// Render the LoginFunction component with a click handler that redirects to the login URL.
class LoginFunction extends React.Component {
    render() {
        const handleLoginClick = () => {
            window.location.href = `${process.env.REACT_APP_PROXY_SERVER_URL}?api=login`;
        };

        return <LoginButton onClick={handleLoginClick} />;
    }
}

// Fetch and return a list of followed artists for the logged-in user.
const getFollowedArtists = async (accessToken) => {
    try {

        let artists = [];
        let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist';
        const requests = [];

        // Iterate through paginated API responses until all followed artists are retrieved.
        while (nextUrl) {
            const response = fetch(nextUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            requests.push(response);

            // Update nextUrl for the next iteration
            const responseData = await (await response).clone().json(); // Clone response before reading JSON
            artists.push(...responseData.artists.items);
            nextUrl = responseData.artists.next;
        }

        // Wait for all requests to resolve.
        const responses = await Promise.all(requests);

        // Check for errors in responses
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Sort artists alphabetically by name
        artists.sort((a, b) => a.name.localeCompare(b.name));

        return artists;

    } catch (error) {
        // Log any errors that occur during the fetch operation and return an empty array.
        console.error('Error fetching followed artists:', error);
        return [];
    }
};

export { LoginFunction, getFollowedArtists };
