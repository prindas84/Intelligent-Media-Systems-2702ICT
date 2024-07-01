import React from 'react';
import stageImage from '../images/Stage.jpg';
import crowdImage from '../images/Crowd.png';

// Render header component with stage and crowd images and app title.
class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <header className="app-header">
                    <img src={stageImage} className="header-stage" alt="stage" />
                    <img src={crowdImage} className="header-crowd" alt="crowd" />
                </header>
                <div className="app-title">
                    <h1 className="audiowide-regular">Gigify</h1>
                </div>
            </div>
        );
    }
}

export default Header;

