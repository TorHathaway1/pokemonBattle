import axios from "axios";

// initialize and return battle-ready pokemon
export const initializePokemonForBattle = async (pokemon) => {
  const speciesData = await getSpeciesData(pokemon);
  await insertGrowthRateToSpeciesData(speciesData);
  pokemon.species = speciesData;
  pokemon.level = await calculatePokemonLevel(pokemon);
  pokemon.moves = await getMovesForPokemon(pokemon);
  return await pokemon;
};

// calculate the pokemon's level based on base + battle experience
export const calculatePokemonLevel = async (pokemon) => {
  let level = pokemon.level;
  for (var i = 0; i < 100 - 1; i++) {
    if (
      pokemon.base_experience + pokemon.experience >
      pokemon.species.growth_rate.levels[i].experience
    ) {
      level = pokemon.species.growth_rate.levels[i].level;
    }
  }
  return level;
};

// returns all species information for a given pokemon
const getSpeciesData = async (pokemon) => {
  return axios
    .get(process.env.REACT_APP_POKEMON_API + "/pokemon-species/" + pokemon.name)
    .then((x) => {
      return x.data;
    });
};

// insert the growth rate into the given species data
const insertGrowthRateToSpeciesData = async (speciesData) => {
  return axios
    .get(
      process.env.REACT_APP_POKEMON_API +
        "/growth-rate/" +
        speciesData.growth_rate.name
    )
    .then((x) => {
      let temp = x.data;
      temp.pokemon_species = null;
      speciesData.growth_rate = temp;
      return speciesData;
    });
};

// get all move information for each of a pokemon's given moves
const getMovesForPokemon = async (pokemon) => {
  const promises = pokemon.moves.map((move, v) => {
    console.log("move", move);
    return axios.get(move.move.url).then(async (response) => {
      return { ...pokemon.moves[v], ...response.data };
    });
  });
  return await Promise.all(promises);
};
