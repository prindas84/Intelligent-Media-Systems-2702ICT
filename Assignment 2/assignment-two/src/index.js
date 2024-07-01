import React from 'react';
import ReactDOM from 'react-dom/client';
import { getAccessToken, initialiseApp } from './control/Auth';
import { LoginController, LogoutController, DescriptionController } from './control/App';
import Header from './view/Header';
import DropdownSelector from './view/VideoSelector';
import './css/styles.css';

// Initialise the app with the access token checks.
initialiseApp();

// Render the header component.
const header = ReactDOM.createRoot(document.getElementById('header'));
header.render(
	<React.StrictMode>
		<Header />
	</React.StrictMode>
);

// If the user has not logged into Spotify, render the login component.
if (getAccessToken() === null) {
	const display = ReactDOM.createRoot(document.getElementById('display'));
	display.render(
		<React.StrictMode>
			<LoginController />
			<DescriptionController />
		</React.StrictMode>
	);
}

// If the user is logged into Spotify and has an access code, render the dropdown selector and the logout button. 
else {
	const display = ReactDOM.createRoot(document.getElementById('display'));
	display.render(
		<React.StrictMode>
			<DropdownSelector />
			<LogoutController />
		</React.StrictMode>
	);
}