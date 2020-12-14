import axios from "axios";

export const initializePokemonForBattle = async (pokemon) => {
  const speciesData = await getSpeciesDataForPokemon(pokemon);
  pokemon.species = await insertGrowthRateToSpeciesData(speciesData);
  pokemon.level = await calculatePokemonLevel(pokemon);
  pokemon.moves = await getMovesForPokemon(pokemon);
  return await pokemon;
};

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

export const calculateExperience = (pokemon, opponent) => {
  // (isPokemonWild * isOriginalTrainer * opponentBaseExperience * isHoldingLuckyEgg * levelOfFaintedPokemon * expPointPowerActive * hasAffectionOfTwoHearts * isAbleToEvolveButHasnt) / (7 * expAllIsInBag)

  // isPokemonWild: 1 if the fainted Pokémon is wild
  //    1.5 if the fainted Pokémon is owned by a Trainer
  let isPokemonWild = 1;
  // opponentBaseExperience: the base experience yield of the fainted Pokémon's species
  let opponentBaseExperience = opponent.base_experience;
  // isHoldingLuckyEgg: 1.5 if the winning Pokémon is holding a Lucky Egg
  //    1 otherwise
  let isHoldingLuckyEgg = 1;
  // hasAffectionOfTwoHearts: 1.2 if the Pokémon has an Affection of two hearts or more
  //    1 otherwise
  let hasAffectionOfTwoHearts = 1;
  // levelOfFaintedPokemon: level of the fainted Pokémon
  let levelOfFaintedPokemon = opponent.level;
  // expPointPowerActive: 1 if no Exp. Point Power (Pass PowerGen V or O-PowerGen VI) is active
  //    If Exp. Point Power [x] is active...
  //    0.5 for ↓↓↓, 0.66 for ↓↓, 0.8 for ↓, 1.2 for ↑, 1.5 for ↑↑, or 2 for ↑↑↑, S, or MAX
  let expPointPowerActive = 1;
  // expAllIsInBag: If Exp. All is not in the player's Bag...
  //      The number of Pokémon that participated in the battle and have not fainted
  //    If Exp. All is in the player's Bag...
  //      Twice the number of Pokémon that participated and have not fainted, when calculating the experience of a Pokémon that participated in battle
  //      Twice the number of Pokémon that participated and have not fainted times the number of Pokémon in the player's party, when calculating the experience given by Exp. All
  let expAllIsInBag = 1;
  // isOriginalTrainer: 1 if the winning Pokémon's current owner is its Original Trainer
  //    1.5 if the Pokémon was gained in a domestic trade
  let isOriginalTrainer = 1;
  // isAbleToEvolveButHasnt: Generation VI+ only: 1.2 if the winning Pokémon is at or past the level where it would be able to evolve, but it has not
  //      1 otherwise
  let isAbleToEvolveButHasnt = 1;

  const experienceGained = Math.ceil(
    (isPokemonWild *
      isOriginalTrainer *
      opponentBaseExperience *
      isHoldingLuckyEgg *
      levelOfFaintedPokemon *
      expPointPowerActive *
      hasAffectionOfTwoHearts *
      isAbleToEvolveButHasnt) /
      (7 * expAllIsInBag)
  );

  console.log(pokemon.name, " gained ", experienceGained, " exp.");

  return experienceGained;
};

export const calculateDamage = (mv, pokemon, opponent) => {
  // ((2A/5+2)*B*C)/D)/50)+2)*X)*Y/10)*Z)/255
  //
  // A = attacker's Level
  // B = attacker's Attack or Special
  // C = attack Power
  // D = defender's Defense or Special
  // X = same-Type attack bonus (1 or 1.5)
  // Y = Type modifiers (40, 20, 10, 5, 2.5, or 0)
  // Z = a random number between 217 and 255

  let attackerLevelx2 = pokemon.level * 2;
  let attackerAttackLevel = pokemon.stats[1].base_stat;
  let movePower = mv.power ? mv.power : 0;
  let defenderDefenseLevel = opponent.stats[2].base_stat;

  let sameTypeBonus = 1;
  if (pokemon.types.findIndex((x) => x.type.name === mv.type.name)) {
    sameTypeBonus = 1.5;
  }

  let randomInt = Math.floor(Math.random() * (255 - 217 + 1)) + 217;

  let a =
    ((attackerLevelx2 / 5 + 2) * attackerAttackLevel * movePower) /
    defenderDefenseLevel;

  let typeModifier = 4;

  let damage = Math.ceil(
    ((((a / 50 + 2) * sameTypeBonus * typeModifier) / 5) * randomInt) / 255
  );

  return damage;
};

const getSpeciesDataForPokemon = async (pokemon) => {
  return await axios
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
    return axios.get(move.move.url).then(async (response) => {
      return { ...pokemon.moves[v], ...response.data };
    });
  });
  return await Promise.all(promises);
};
