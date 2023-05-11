import React from 'react';
import ReactPlayer from 'react-player';

const Player = (props) => {
return (
    <ReactPlayer
    // url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    url = {props.url}
    width="100%"
    height="100%"
    controls
    />
)
}

export default Player;