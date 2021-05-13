import { Header } from "../components/Header";
import { GetStaticProps } from 'next';
import { api } from "../services/api";

type Episode = {
  id: string;
  title: string;
  members: string;
  // ...
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
export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });
  const data = response.data;

  return {
    props: {
      episodes: data,
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