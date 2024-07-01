import React, { useState } from 'react';
import { LoginFunction } from '../model/Spotify';
import LogoutButton from '../view/Logout';
import { DescriptionButton, InstructionsModal } from '../view/Description';
import { removeAccessToken } from '../control/Auth';

// Controller for handling login functionality.
const LoginController = ({ onClick }) => {
    return (
        // Render the LoginFunction component with the onClick prop.
        <LoginFunction onClick={onClick} />
    );
}

// Controller for handling logout functionality.
const LogoutController = () => {
    // Render the LoginFunction component with the onClick prop.
    const handleLogout = () => {
        removeAccessToken();
        window.history.pushState({}, document.title, window.location.pathname);
        window.location.reload();
    };

    // Render the LogoutButton component with the handleLogout function as onClick handler.
    return (
        <div>
            <LogoutButton onClick={handleLogout} />
        </div>
    );
}

// Controller for handling app description functionality.
const DescriptionController = () => {
    const [showModal, setShowModal] = useState(false);

    // When description button is clicked, show the modal.
    const handleButtonClick = () => {
        setShowModal(true);
    };

    // When the close button is clicked, close the modal.
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Render the DesciptionButton component with the InstructionsModal and click functionality.
    return (
        <div>
            <DescriptionButton onClick={handleButtonClick} />
            {showModal && <InstructionsModal onClose={handleCloseModal} />}
        </div>
    );
};


export { LoginController, LogoutController, DescriptionController };