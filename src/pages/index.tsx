import { Header } from "../components/Header";
import { api } from "../services/api";
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { GetStaticProps } from "next";
import Link from "next/link";
import { parseISO } from "date-fns";
import Image from "next/image";

import styles from './home.module.scss';


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string,
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              //Esse key usado abaixo eh uma propriedade pra performance do React.
              //Quando se usa um map, e eh gerado uma lista de componentes assim, o elemento que eh
              //retornado logo em seguida precisa ter uma propriedade unica daquele elemento.
              //Pq com esse dado único o React consegue otimizar o carregamento da pagina em caso de exclusao
              //de um item especifico, ou na insercao de um item especifico e etc
              <li key={episode.id}>
                <Image src={episode.thumbnail} alt={episode.title} width={192} height={192} objectFit="cover" />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>

                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>

              </li>
            )
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
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 55 }}>
                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>

                  </td>
                  <td>
                    {episode.members}
                  </td>
                  <td style={{ width: 80 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </section>
    </div>

  )
}

//Utilizando SSG, para poder gerar sites estáticos, e melhorar muito a performance da aplicação.
//Usando essa função só é feita uma nova requisição para a API de 8h em 8h, então quem acessar antes recebe uma versão
//estática da página. E isso faz carregar MUITO rápido. 
//Aqui eu também uso o pacote json-server para poder simular uma API, só que rodando local, e assim acessar os dados dos podcasts
//Tava dando erro quando tipava o getStaticProps, então tirei, e agr n tá mais dando erro
export const getStaticProps = async (context) => {
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const data = response.data;

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8
  }
}


//Outra forma de fazer isso é usando SPA, o mais comum no React, e que faz a requisição sempre que alguém acesssa
/*

  import { useEffect } from "react";

export default function Example() {
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])

  return (
    <div>
      <h1> Index</h1>
    </div>

  )
}

*/