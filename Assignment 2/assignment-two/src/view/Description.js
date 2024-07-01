import React from 'react';

// Functional component for the logout button.
const DescriptionButton = ({ onClick }) => {
    return (
        <div className="description">
            <div className="description-button">
                <button className="nunito-login" onClick={onClick}>Description</button>
            </div>
        </div>
    );
};

// Functional component to display the description modal.
const InstructionsModal = ({ onClose }) => {
    return (
        <div className="overlay">
            <div className="modal-content">
                <div className="instructions">
                    <h2>Gigafy Application Description</h2>
                    <p>
                        Gigafy is a cutting-edge web-based platform crafted to enhance the concert experience for music enthusiasts. By seamlessly integrating with Spotify and YouTube APIs, Gigafy empowers users to effortlessly discover and enjoy live concert videos of their favourite artists.
                    </p>
                    <h3>Key Features:</h3>
                    <ol>
                        <li>
                            <strong>Personalised Artist Matching:</strong> Gigafy extracts the followed artists from a user's Spotify account, providing a curated selection of their favourite bands and musicians.
                        </li>
                        <li>
                            <strong>Tailored Concert Recommendations:</strong> Users can easily browse through the list of followed artists and select the desired performer. Gigafy then utilises advanced algorithms to identify and present the most relevant live concert videos from YouTube.
                        </li>
                        <li>
                            <strong>Seamless Integration:</strong> Through OAuth 2.0 authentication, Gigafy securely connects to users' Spotify accounts, ensuring a smooth and secure login process.
                        </li>
                        <li>
                            <strong>Dynamic Search:</strong> Leveraging the power of the YouTube API, Gigafy dynamically searches for live concert videos based on user preferences, delivering an immersive and engaging viewing experience.
                        </li>
                        <li>
                            <strong>User-Friendly Interface:</strong> With an intuitive interface, Gigafy offers a seamless and enjoyable browsing experience, allowing users to effortlessly navigate through their favourite artists and discover captivating live performances.
                        </li>
                        <li>
                            <strong>Convenient Logout Option:</strong> Users have the flexibility to log out at any time or let their Spotify access code expire naturally, ensuring privacy and security.
                        </li>
                    </ol>
                    <p>
                        Gigafy revolutionises the way music lovers connect with their favourite artists, bringing the electrifying atmosphere of live concerts directly to their screens. Whether reliving cherished memories or exploring new performances, Gigafy promises an unforgettable journey through the world of live music.
                    </p>
                </div>
                <button className="close-button" onClick={onClose}>CLOSE</button>
            </div>
        </div>
    );
};

export { DescriptionButton, InstructionsModal };