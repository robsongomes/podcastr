export default function Home(props) {
  return <h1>{JSON.stringify(props.episodes)}</h1>;
}

export async function getServerSideProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const episodes = await response.json();

  return {
    props: {
      episodes,
    },
  };
}

// export async function getStaticProps() {
//   const response = await fetch("http://localhost:3333/episodes");
//   const episodes = await response.json();

//   return {
//     props: {
//       episodes,
//     },
//     revalidate: 60 * 60 * 8,
//   };
// }
