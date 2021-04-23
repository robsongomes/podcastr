import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { api } from "../serivces/api";
import styles from "./home.module.scss";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
  members: string;
};

type HomeProps = {
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { currentEpisode, episodes, play } = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos de {episodes[currentEpisode]?.title}</h2>
        <ul>
          {latestEpisodes.map((ep) => {
            return (
              <li key={ep.id}>
                <Image
                  width={192}
                  height={192}
                  src={ep.thumbnail}
                  alt={ep.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{ep.title}</a>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAt}</span>
                  <span>{ep.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(ep)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((ep) => {
              return (
                <tr key={ep.id}>
                  <td style={{ width: 100 }}>
                    <Image
                      width={120}
                      height={120}
                      src={ep.thumbnail}
                      alt={ep.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`episodes/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  <td>{ep.members}</td>
                  <td style={{ width: 100 }}>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="Tocar Episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// export async function getServerSideProps() {
//   const response = await fetch("http://localhost:3333/episodes");
//   const episodes = await response.json();

//   return {
//     props: {
//       episodes,
//     },
//   };
// }

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes: Array<Episode> = data.map((episode) => {
    const ep: Episode = {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      thumbnail: episode.thumbnail,
      url: episode.file.url,
      description: episode.description,
    };

    return ep;
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
