import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";

import PokemonContainer from "../components/PokemonContainer";

import {
  calculatePokemonLevel,
  initializePokemonForBattle,
} from "../common/pokemonFunctions";

const bgs = [
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d83i5qk-329cf19f-2025-4333-b2b2-7a3400e07d94.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODNpNXFrLTMyOWNmMTlmLTIwMjUtNDMzMy1iMmIyLTdhMzQwMGUwN2Q5NC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.gbcaaHz3bl2NOpGWmk1VXkr9DYL2NB-VRui6XW5IYdA",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d874gjl-59e79083-fec5-4234-8879-2aa8afd7f9f4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODc0Z2psLTU5ZTc5MDgzLWZlYzUtNDIzNC04ODc5LTJhYThhZmQ3ZjlmNC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.UMFdXoCcqHSZ0U3dFWt8351ncIACJOCM9Zrb_tBzx90",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d88wyk1-5825bbcc-0104-4317-b743-065122db1d15.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODh3eWsxLTU4MjViYmNjLTAxMDQtNDMxNy1iNzQzLTA2NTEyMmRiMWQxNS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.WmlHYwGcmpuhFePCOSjIY3V1905aGVFeiXVGtBxL_iM",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d8937eq-0475612f-9da7-482c-b3db-f481329d5a53.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODkzN2VxLTA0NzU2MTJmLTlkYTctNDgyYy1iM2RiLWY0ODEzMjlkNWE1My5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.KznpC3PU2uS0MyT5FtlS2qAneA8xWanUZBNuteEbadk",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d87700j-41e3e246-6716-46bf-820e-fb7b9e17d66d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODc3MDBqLTQxZTNlMjQ2LTY3MTYtNDZiZi04MjBlLWZiN2I5ZTE3ZDY2ZC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.axYat0vO0fOULsCexfyYuA6h6mIeLI6owighvh_aTjY",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d88wvad-5f045d49-989f-4a2e-b95d-170b5cef57fa.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODh3dmFkLTVmMDQ1ZDQ5LTk4OWYtNGEyZS1iOTVkLTE3MGI1Y2VmNTdmYS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.j6Buf_o0glyCxGwjHthg9_kzO7J4SfPXeRK4LZZ0lb4",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d83m6q1-a731bf85-a0ff-47b4-9c3b-6627f067d056.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODNtNnExLWE3MzFiZjg1LWEwZmYtNDdiNC05YzNiLTY2MjdmMDY3ZDA1Ni5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.gY5bF4JEdtoDvygm7YRJ5ZlN2CDCS3ReVAnnc5F7xtM",
];

const bgSelectInt = Math.ceil(Math.random() * bgs.length - 1);

function BattleGround(props) {
  const [pokemonArray, setPokemonArray] = useState(props.selectedPokemon);
  const [challenger, setChallenger] = useState(props.opponent);
  const [battle, setBattle] = useState({});

  useEffect(() => {
    initializeBattle();
  }, [pokemonArray && props.timeForBattle]);

  useEffect(() => {
    console.log(battle);
    gameOver();
  }, [battle]);

  const initializeBattle = async () => {
    let tempBattle = {};
    tempBattle[pokemonArray[0].name] = pokemonArray[0];
    tempBattle[pokemonArray[1].name] = pokemonArray[1];
    tempBattle[pokemonArray[0].name].health = 100;
    tempBattle[pokemonArray[1].name].health = 100;
    tempBattle.moves = [];
    setBattle(tempBattle);
  };

  const attack = (mvDam, pokemon, opponent, success) => {
    let tempBattle = battle;
    let opponentNewHealth = tempBattle[opponent.name].health - mvDam;
    if (opponentNewHealth < 0) {
      opponentNewHealth = 0;
    }
    tempBattle[opponent.name].health = opponentNewHealth;
    tempBattle.moves.push({
      attacker: pokemon.name,
      defender: opponent.name,
      damage: mvDam,
      success: success,
    });
    setBattle({ ...tempBattle });
  };

  const gameOver = () => {
    let pokeArr = Object.values(battle).slice(0, 2);
    let loserIndex = pokeArr.findIndex((x) => x.health === 0);
    let winnerIndex = pokeArr.findIndex((x) => x.health !== 0);
    pokeArr.map(async (p, i) => {
      if (p.health === 0) {
        let exp = calculateExperience(
          pokeArr[winnerIndex],
          pokeArr[loserIndex]
        );
        props.selectedPokemon[winnerIndex].experience =
          props.selectedPokemon[winnerIndex].experience + exp;
        props.selectedPokemon[winnerIndex].level = await calculatePokemonLevel(
          props.selectedPokemon[winnerIndex]
        );
        props.setPokemonForUser(props.selectedPokemon[winnerIndex]);
        props.setExpForUser(exp);
        setTimeout(() => {
          props.setTimeForBattle(false);
        }, 2000);
      }
    });
  };

  const calculateExperience = (pokemon, opponent) => {
    // (a * t * b * e * L * p * f * v) / (7 * s)

    // a: 1 if the fainted Pokémon is wild
    //    1.5 if the fainted Pokémon is owned by a Trainer
    let a = 1;
    // b: the base experience yield of the fainted Pokémon's species
    let b = opponent.base_experience;
    // e: 1.5 if the winning Pokémon is holding a Lucky Egg
    //    1 otherwise
    let e = 1;
    // f: 1.2 if the Pokémon has an Affection of two hearts or more
    //    1 otherwise
    let f = 1;
    // L: level of the fainted Pokémon
    let l = opponent.level;
    // p: 1 if no Exp. Point Power (Pass PowerGen V or O-PowerGen VI) is active
    //    If Exp. Point Power [x] is active...
    //    0.5 for ↓↓↓, 0.66 for ↓↓, 0.8 for ↓, 1.2 for ↑, 1.5 for ↑↑, or 2 for ↑↑↑, S, or MAX
    let p = 1;
    // s: If Exp. All is not in the player's Bag...
    //      The number of Pokémon that participated in the battle and have not fainted
    //    If Exp. All is in the player's Bag...
    //      Twice the number of Pokémon that participated and have not fainted, when calculating the experience of a Pokémon that participated in battle
    //      Twice the number of Pokémon that participated and have not fainted times the number of Pokémon in the player's party, when calculating the experience given by Exp. All
    let s = 1;
    // t: 1 if the winning Pokémon's current owner is its Original Trainer
    //    1.5 if the Pokémon was gained in a domestic trade
    let t = 1;
    // v: Generation VI+ only: 1.2 if the winning Pokémon is at or past the level where it would be able to evolve, but it has not
    //      1 otherwise
    let v = 1;

    console.log(
      pokemon.name,
      " gained ",
      Math.ceil((a * t * b * e * l * p * f * v) / (7 * s)),
      " exp."
    );

    return Math.ceil((a * t * b * e * l * p * f * v) / (7 * s));
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        backgroundImage: "url('" + bgs[bgSelectInt] + "')",
        backgroundPosition: 0,
        backgroundSize: "cover",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      {Object.values(battle).length === 3 &&
        Object.values(battle)
          .slice(0, 2)
          .map((p, i) => {
            return (
              <PokemonContainer
                me={i}
                pokemonTypes={props.pokemonTypes}
                key={p.name}
                attack={attack}
                setSelectedPokemon={props.setSelectedPokemon}
                battle={battle}
                pokemon={p}
                fainted={p.health === 0}
                setPokemonArray={setPokemonArray}
              />
            );
          })}
    </Container>
  );
}

export default BattleGround;
