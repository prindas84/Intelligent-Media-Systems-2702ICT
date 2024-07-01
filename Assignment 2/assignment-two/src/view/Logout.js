import React from 'react';

// Functional component for the logout button.
const LogoutButton = ({ onClick }) => {
    return (
        <div className="logout">
            <div className="logout-button">
                <button className="nunito-login" onClick={onClick}>Logout</button>
            </div>
        </div>
    );
}

export default LogoutButton;