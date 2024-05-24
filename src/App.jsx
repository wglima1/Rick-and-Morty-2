import React, { useState } from 'react';
import './App.css';

const App = () => {
  // Define os estados usando o useState hook do React
  const [character, setCharacter] = useState(null); // Estado para armazenar os dados do personagem
  const [number, setNumber] = useState(1); // Estado para armazenar o número do personagem
  const [loading, setLoading] = useState(false); // Estado para controlar o status de carregamento
  const [error, setError] = useState(null); // Estado para armazenar mensagens de erro

  // Função assíncrona para buscar dados do personagem na API
  const fetchCharacter = async (characterNumber) => {
    setLoading(true); // Define o carregamento como true para exibir mensagem de carregamento
    setError(null); // Limpa mensagens de erro anteriores
    setCharacter(null); // Limpa dados de personagem anteriores
    try {
      // Faz a requisição para a API usando o número do personagem
      const response = await fetch(`https://rickandmortyapi.com/api/character/${characterNumber}`);
      if (!response.ok) {
        throw new Error('Não encontrado'); // Lança um erro se a resposta não for bem-sucedida
      }
      const data = await response.json(); // Converte a resposta para JSON
      // Obtém os dados dos episódios em que o personagem aparece
      const episodePromises = data.episode.map((episodeUrl) => fetch(episodeUrl).then((res) => res.json()));
      const episodes = await Promise.all(episodePromises); // Aguarda a resolução de todos os episódios

      // Ordena os episódios 
      const sortedEpisodes = episodes.sort((a, b) => {
        const episodeA = parseInt(a.episode.match(/E(\d+)/)[1], 10);
        const episodeB = parseInt(b.episode.match(/E(\d+)/)[1], 10);
        return episodeA - episodeB;
      });

      // Atualiza o estado do personagem com os dados obtidos da API
      setCharacter({ ...data, episodes: sortedEpisodes });
    } catch (err) {
      setError(err.message); // Captura e define qualquer erro ocorrido durante a busca de dados
    } finally {
      setLoading(false); // Define loading como false após a conclusão da busca
    }
  };

  
  const handlePrevious = () => {
    if (number > 1) {
      const newNumber = number - 1;
      setNumber(newNumber);
      fetchCharacter(newNumber); // Busca dados do personagem anterior
    }
  };

  
  const handleNext = () => {
    const newNumber = number + 1;
    setNumber(newNumber);
    fetchCharacter(newNumber); // Busca dados do próximo personagem
  };

  
  const handleSearch = () => {
    if (number > 0) {
      fetchCharacter(number); // Busca dados do personagem com o número especificado
    }
  };

  // Renderiza o conteúdo na página
  return (
    <div className="container">
      <div className="caixa-container">
        <h1> Rick and Morty</h1>
        
        {/* Input para inserir o número do personagem */}
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Digite"
          required 
        /> 
        
        {/* Botões para navegar pelos personagens e pesquisar */}
        <div className="buttons">
          <button onClick={handlePrevious} disabled={number <= 1}>Anterior</button>
          <button onClick={handleNext}>Próximo</button>
          <button onClick={handleSearch}>Pesquisar</button>
        </div>
        
        {/* Exibe mensagem de carregamento, erro ou os dados do personagem */}
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {character && (
          <div className="character">
            <h2>{character.name}</h2>
            <img src={character.image} alt={character.name} />
            <p>Status: {character.status}</p>
            <p>Espécies: {character.species}</p>
            <p>Gênero: {character.gender}</p>
            <p>Origem: {character.origin.name}</p>
            <p>localidade: {character.location.name}</p>
            <p>Criada: {character.created}</p>
            <h3>Episodes</h3>
            <ul>
              {character.episodes.map((episode) => (
                <li key={episode.id}>{episode.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
