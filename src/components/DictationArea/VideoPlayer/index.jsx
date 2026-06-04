import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import styles from "./VideoPlayer.module.scss";

const VideoPlayer = forwardRef(({ src, onPlayerReady, onStateChange }, ref) => {
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [isAPIReady, setIsAPIReady] = useState(false);

    useEffect(() => {
        // Load YouTube API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                setIsAPIReady(true);
            };
        } else {
            setIsAPIReady(true);
        }
    }, []);

    useEffect(() => {
        if (isAPIReady && src && !player) {
            const videoId = src.split('v=')[1]?.split('&')[0];
            if (videoId) {
                const newPlayer = new window.YT.Player(playerRef.current, {
                    height: '315',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        'playsinline': 1,
                        'modestbranding': 1,
                        'rel': 0,
                        'showinfo': 0,
                        'iv_load_policy': 3,
                        'fs': 1,
                        'cc_load_policy': 0,
                        'disablekb': 1,
                        'controls': 1,
                        'autoplay': 0,
                        'start': 0
                    },
                    events: {
                        'onReady': (event) => {
                            setPlayer(event.target);
                            if (onPlayerReady) onPlayerReady(event.target);
                        },
                        'onStateChange': (event) => {
                            if (onStateChange) onStateChange(event);
                        }
                    }
                });
            }
        }
    }, [isAPIReady, src, onPlayerReady, onStateChange]);

    useImperativeHandle(ref, () => ({
        seekTo: (time) => {
            if (player && player.seekTo) {
                player.seekTo(time);
            }
        },
        playVideo: () => {
            if (player && player.playVideo) {
                player.playVideo();
            }
        },
        pauseVideo: () => {
            if (player && player.pauseVideo) {
                player.pauseVideo();
            }
        },
        getCurrentTime: () => {
            if (player && player.getCurrentTime) {
                return player.getCurrentTime();
            }
            return 0;
        },
        getPlayerState: () => {
            if (player && player.getPlayerState) {
                return player.getPlayerState();
            }
            return -1;
        }
    }));

    return (
        <div className={styles.videoPlayer}>
            <div ref={playerRef}></div>
        </div>
    );
});

export default VideoPlayer;