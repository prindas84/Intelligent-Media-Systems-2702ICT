import React from 'react';

class VideoDisplay extends React.Component {

    // Initialize state variables.
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: null,
            currentArtist: props.selectedArtist,
            videoId: null
        };

    }

    // Fetches video data for the selected artist. If no artist is selected, set isLoading to false and return.
    fetchArtistData(artist) {
        if (!artist) {
            this.setState({
                isLoading: false,
                error: null,
                currentArtist: '',
                videoId: null
            });
            return;
        }

        // Construct URL for fetching video data.
        const url = `${process.env.REACT_APP_PROXY_SERVER_URL}?api=google&artist=${encodeURIComponent(artist)}`;

        // Fetch video data from the URL.
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            // Update state with videoId from fetched data.
            .then(data => {
                this.setState({
                    isLoading: false,
                    videoId: data[0].id.videoId
                });
            })
            // Handle and log any errors that occur during fetch.
            .catch(error => {
                this.setState({
                    error,
                    isLoading: false
                });
            });
    }

    // Fetch data when component mounts.
    componentDidMount() {
        this.fetchArtistData(this.props.selectedArtist);
    }

    // Fetch data when selected artist changes.
    componentDidUpdate(prevProps) {
        if (this.props.selectedArtist !== prevProps.selectedArtist) {
            this.setState({
                isLoading: true,
                error: null,
                currentArtist: this.props.selectedArtist
            });
            this.fetchArtistData(this.props.selectedArtist);
        }
    }

    render() {
        const { isLoading, error, videoId } = this.state;

        // Handle different loading states.
        if (isLoading) {
            return <div className="video-message"><p>Please Wait - The Band Is Getting Ready...</p></div>;
        }

        if (error) {
            return <div className="video-message"><p>Error: {error.message}.</p></div>;
        }

        if (!videoId) {
            return;
        }

        // Construct YouTube embed URL. Set height. Width is set automatically to maintain ratio.
        const youTubeURL = `https://www.youtube.com/embed/${videoId}`;
        const height = 340;
        const width = (height * 16) / 9;

        // Render video player iframe.
        return (
            <div className="video-display">
                <iframe
                    className="video-iframe"
                    width={width}
                    height={height}
                    src={youTubeURL}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }
}

export default VideoDisplay;
