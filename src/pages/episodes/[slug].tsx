import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { api } from "../../serivces/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";

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

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={780}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button>
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { data } = await api.get(`episodes/${ctx.params.slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    thumbnail: data.thumbnail,
    url: data.file.url,
    description: data.description,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 8,
  };
};
