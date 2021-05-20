import { useEffect, useRef } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from "next/image";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);

    const { episodeList,
        currentEpisodeIndex,
        isPlaying,
        tooglePlay,
        playNext,
        playPrevious,
        setPlayingState,
        hasPrevious,
        hasNext
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }), [isPlaying]

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>

            ) : (
                <div className={styles.emptyPlayer}>
                    <p>Selecione um podcast para ouvir</p>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>

                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361' }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>


                {episode && ( //Essa forma de usar && eh quando vc tem um ternario e só quer executar o if, nao tem outra execucao possivel depois. Nesse caso, eu só quero tocar se tiver episodio, se não tiver, quero fazer nada
                    <audio
                        src={episode.url}
                        ref={audioRef} //Essa ref eh usada para conseguir no React pegar o elemento HTML audio, e assim conseguir parar de tocar quando pausar
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={tooglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Pausar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }

                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>

            </footer>

        </div>
    );
}