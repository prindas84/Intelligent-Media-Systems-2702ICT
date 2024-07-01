import React from 'react';
import { getFollowedArtists } from '../model/Spotify';
import { getAccessToken } from '../control/Auth';
import VideoDisplay from '../model/YouTube';

class DropdownSelector extends React.Component {

    // Initialize state variables.
    constructor(props) {
        super(props);
        this.state = {
            artists: [],
            loading: true,
            error: null,
            selectedArtist: ''
        };
    }

    async componentDidMount() {
        // Fetch access token and followed artists data. Update state with fetched artists and set loading to false.
        try {
            const accessToken = await getAccessToken();
            const artists = await getFollowedArtists(accessToken);
            this.setState({ artists, loading: false });
        }
        // Handle and log errors that occur during data fetching.
        catch (error) {
            console.error('Error fetching followed artists:', error);
            this.setState({ error: 'Error fetching artists', loading: false });
        }
    }

    // Event handler for dropdown selection change.
    handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        this.setState({ selectedArtist: selectedValue });
    }

    render() {

        // Extract the state variables.
        const { artists, loading, error, selectedArtist } = this.state;

        if (loading) {
            return (
                <div className="selector">
                    <div><h2 className="metal-mania-regular">Loading...</h2></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="selector">
                    <div><h2 className="metal-mania-regular">Error: {error}</h2></div>
                </div>
            );
        }

        // Render dropdown selector with fetched artists and video display component.
        return (
            <div className="selector">
                <div>
                    <h2 className="metal-mania-regular">Select Your Band Below</h2>
                </div>
                <div className="custom-select">
                    <select onChange={this.handleSelectChange} value={selectedArtist}>
                        <option value="" defaultValue>GET TICKETS HERE</option>
                        {artists.map(artist => (
                            <option key={artist.id} value={artist.name}>{artist.name}</option>
                        ))}
                    </select>
                </div>
                <VideoDisplay selectedArtist={selectedArtist} />
            </div>
        );
    }
}

export default DropdownSelector;
