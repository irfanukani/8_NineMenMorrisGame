import React, { useState } from 'react';

const AudioPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        setIsPlaying((prevState) => !prevState);
    };

    return (
        <div className='absolute top-5 right-5'>
            <button onClick={togglePlay} className='bg-gray-700 p-4 rounded-full w-12 h-12'>
                {isPlaying ? <i className="fa-solid fa-volume-high"></i> : <i className="fa-solid fa-volume-xmark"></i>}
            </button>
            {isPlaying && <audio src={src} autoPlay loop />}
        </div>
    );
};

export default AudioPlayer;
