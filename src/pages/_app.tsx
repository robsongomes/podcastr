import { Header } from "../components/Header";
import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { Player } from "../components/Player";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodes([episode]);
    setCurrentEpisode(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  return (
    <PlayerContext.Provider
      value={{ episodes, currentEpisode, isPlaying, play, togglePlay }}
    >
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp;
