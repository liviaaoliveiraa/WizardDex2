const PERSONAGENS_API_URL =
  'https://potterapi-fedeperin.vercel.app/en/characters';

export async function buscarPersonagens() {
  const response = await fetch(PERSONAGENS_API_URL);

  if (!response.ok) {
    throw new Error(`Falha ao carregar personagens: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('A API não retornou personagens.');
  }

  return data.map((personagem) => ({
    id: `potterapi-${personagem.index}`,
    name: personagem.fullName,
    actor: personagem.interpretedBy,
    house: personagem.hogwartsHouse,
    dateOfBirth: personagem.birthdate,
    image: personagem.image,
  }));
}
