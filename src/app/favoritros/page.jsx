'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '@/components/Header/Header';
import CardPersonagens from '@/components/Personagens/Card/CardPersonagens';
import ModalPersonagens from '@/components/Personagens/Modal/ModalPersonagens';
import styles from './personagens.module.css';

export default function PersonagensPage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('geral');

  useEffect(() => {
    const carregarPersonagens = async () => {
      try {
        setError(null);

        const personagensSalvos = localStorage.getItem('personagens');
        const favoritosSalvos = sessionStorage.getItem('favoritos');

        if (favoritosSalvos) {
          setFavorites(JSON.parse(favoritosSalvos));
        }

        if (personagensSalvos) {
          setCharacters(JSON.parse(personagensSalvos));
          setLoading(false);
          return;
        }

        setLoading(true);

        const response = await axios.get(
          'https://hp-api.onrender.com/api/characters'
        );

        setCharacters(response.data);

        localStorage.setItem(
          'personagens',
          JSON.stringify(response.data)
        );
      } catch (err) {
        setError(
          'Ocorreu um erro ao carregar os personagens. Tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    carregarPersonagens();
  }, []);

  const handleToggleFavorite = (character, e) => {
    e.stopPropagation();

    const isFav = favorites.includes(character.id);

    let novosFavoritos;

    if (isFav) {
      novosFavoritos = favorites.filter(
        (id) => id !== character.id
      );

      toast.info(
        `${character.name} foi removido dos favoritos! 💔`,
        {
          theme: 'dark',
        }
      );
    } else {
      novosFavoritos = [...favorites, character.id];

      toast.success(
        `${character.name} foi adicionado aos favoritos! ✨`,
        {
          theme: 'dark',
        }
      );
    }

    setFavorites(novosFavoritos);

    sessionStorage.setItem(
      'favoritos',
      JSON.stringify(novosFavoritos)
    );
  };

  const personagensExibidos =
    activeTab === 'geral'
      ? characters
      : characters.filter((character) =>
          favorites.includes(character.id)
        );

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
        />

        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Galeria de Personagens
          </h1>

          <p className={styles.pageSubtitle}>
            Explore e conheça os bruxos e bruxas registrados no Ministério da Magia.
          </p>
        </header>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'geral' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('geral')}
          >
            Geral
          </button>

          <button
            className={`${styles.tabButton} ${
              activeTab === 'favoritos' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('favoritos')}
          >
            Favoritos ❤️
          </button>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Lumos! Carregando personagens...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <h2>🪄 Feitiço Falhou!</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'favoritos' &&
              personagensExibidos.length === 0 ? (
              <div className={styles.emptyMessage}>
                <h2>✨ Nenhum personagem foi favoritado!</h2>
                <p>
                  Volte para a aba Geral e favorite alguns personagens.
                </p>
              </div>
            ) : (
              <div className={styles.charactersGrid}>
                {personagensExibidos.map((char) => (
                  <CardPersonagens
                    key={char.id}
                    character={char}
                    onSelect={setSelectedCharacter}
                    isFavorite={favorites.includes(char.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {selectedCharacter && (
          <ModalPersonagens
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
      </main>
    </div>
  );
}
