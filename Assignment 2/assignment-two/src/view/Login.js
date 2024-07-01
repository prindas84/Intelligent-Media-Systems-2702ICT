import React from 'react';
import spotifyLogo from '../images/Spotify_Logo_RGB_Green.png';

// Functional component for the login button.
const LoginButton = ({ onClick }) => {
    return (
        <div className="login">
            <div className="login-button">
                <button className="nunito-login" onClick={onClick}>Login</button>
            </div>
            <div className="spotify-logo">
                <img src={spotifyLogo} alt="Spotify Logo" />
            </div>
        </div>
    );
}

export default LoginButton;