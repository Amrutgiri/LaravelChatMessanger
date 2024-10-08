import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React,{ useRef, useState } from "react";

const CustomAudioPlayer = ({ file,showVolume=true }) => {
    const audiRef= useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlayPause = () => {
        const audio = audiRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
           console.log(audio, audio.duration);
           setDuration(audio.duration);
            audio.play();
        }
        setIsPlaying(!isPlaying);
    }

    const handleVolumeChange = (e) => {
        const volume=e.target.value;
        audiRef.current.volume=volume;
        setVolume(volume);
    }

    const handleTimeUpdate = (e) => {
        const audio = audiRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    }

    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    }

    const handleSeekChange=(e)=>{
        const time = e.target.value;
        audiRef.current.currentTime=time;
        setCurrentTime(time);
    }
    return (
        <div className="flex items-center w-full gap-2 px-3 py-2 rounded-md bg-slate-800">
            <audio ref={audiRef} src={file.url} controls onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} className="hidden" />
            <button onClick={togglePlayPause} >
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {showVolume && (
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />

            )}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeekChange}
            />
        </div>
    );
}

export default CustomAudioPlayer;
