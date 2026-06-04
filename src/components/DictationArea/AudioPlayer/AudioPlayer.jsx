import { useRef, useState, useEffect } from "react";
import styles from "./AudioPlayer.module.scss";

function AudioPlayer({ src }) {
    const audioRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [speed, setSpeed] = useState(1);

    const changeSpeed = (rate) => {
        const audio = audioRef.current;
        audio.playbackRate = rate;
        setSpeed(rate);
        setOpen(false);
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className={styles.audioPlayer}>
            <audio
                ref={audioRef}
                src={src}
                controls
                style={{ width: "100%" }}
            />
            <button className={styles.speedController} ref={dropdownRef} onClick={() => setOpen(!open)}>
                {speed}x
                {open && (
                <div className={styles.menu}>
                    <ul>
                        <li onClick={() => changeSpeed(0.5)}>Speed: 0.5x</li>
                        <li onClick={() => changeSpeed(0.6)}>Speed: 0.6x</li>
                        <li onClick={() => changeSpeed(0.7)}>Speed: 0.7x</li>
                        <li onClick={() => changeSpeed(0.8)}>Speed: 0.8x</li>
                        <li onClick={() => changeSpeed(0.9)}>Speed: 0.9x</li>
                        <li onClick={() => changeSpeed(1)}>Speed: 1x</li>
                        <li onClick={() => changeSpeed(1.1)}>Speed: 1.1x</li>
                        <li onClick={() => changeSpeed(1.2)}>Speed: 1.2x</li>
                        <li onClick={() => changeSpeed(1.3)}>Speed: 1.3x</li>
                        <li onClick={() => changeSpeed(1.4)}>Speed: 1.4x</li>
                        <li onClick={() => changeSpeed(1.5)}>Speed: 1.5x</li>
                    </ul>
                </div>
            )}
            </button>
            
        </div>
    );
}

export default AudioPlayer;