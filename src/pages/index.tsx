import { Header } from "../components/Header";
import { api } from "../services/api";
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { GetStaticProps } from "next";
import { parseISO } from "date-fns";


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string,
  publishedAt: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1> Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>

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
      description: episode.description,
      url: episode.file.url,
    };
  })

  return {
    props: {
      episodes: episodes,
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