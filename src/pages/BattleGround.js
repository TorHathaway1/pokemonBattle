import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";

import PokemonContainer from "../components/PokemonContainer";
import GameOverDialog from "../components/GameOverDialog";
import { calculatePokemonLevel } from "../common/pokemonFunctions";
import { backgroundImgArray } from "../constants/vars";
import firebase from "../firebaseConfig";

const randomNumberForBackgroundImgSelection = Math.ceil(
  Math.random() * backgroundImgArray.length - 1
);

function BattleGround(props) {
  const db = firebase.database();
  const [usersPokemonCollection, setUsersPokemonCollection] = useState(
    props.selectedPokemon
  );
  const [battle, setBattle] = useState({});
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [expGainedForWinner, setExpGainForWinner] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    initializeBattle();
  }, [usersPokemonCollection && props.timeForBattle]);

  useEffect(() => {
    gameOver();
  }, [battle]);

  const initializeBattle = async () => {
    let initialBattle = {};
    initialBattle[usersPokemonCollection[0].name] = usersPokemonCollection[0];
    initialBattle[usersPokemonCollection[1].name] = usersPokemonCollection[1];
    initialBattle[usersPokemonCollection[0].name].health = 100;
    initialBattle[usersPokemonCollection[1].name].health = 100;
    initialBattle.moves = [];

    setBattle(initialBattle);
    insertBattleIntoDb(initialBattle);
    initializeFirebaseBattleListener();
  };

  const insertBattleIntoDb = async (battle) => {
    return db.ref("battles/" + props.user.uid).set(battle);
  };

  const initializeFirebaseBattleListener = () => {
    let battleRef = firebase.database().ref("battles/" + props.user.uid);
    battleRef.on("value", (snapshot) => {
      let updatedBattle = snapshot.val();
      let firstMoveHasBeenMade = Object.values(updatedBattle).length > 2;
      if (firstMoveHasBeenMade) {
        setBattle(updatedBattle);
      }
    });
  };

  const gameOver = () => {
    let pokemonInBattle = Object.values(battle).slice(0, 2);
    let loserIndex = pokemonInBattle.findIndex((x) => x.health === 0);
    let winnerIndex = pokemonInBattle.findIndex((x) => x.health !== 0);
    pokemonInBattle.map(async (p, i) => {
      if (p.health === 0) {
        resetEachUsersFightingStatus();
        let expGained = calculateExperience(
          pokemonInBattle[winnerIndex],
          pokemonInBattle[loserIndex]
        );
        setExpGainForWinner(expGained);
        setWinner(props.selectedPokemon[winnerIndex]);
        props.selectedPokemon[winnerIndex].experience =
          props.selectedPokemon[winnerIndex].experience + expGained;
        props.selectedPokemon[winnerIndex].level = await calculatePokemonLevel(
          props.selectedPokemon[winnerIndex]
        );
        props.setPokemonForUser(props.selectedPokemon[winnerIndex]);
        setExpForUser(expGained);
        setTimeout(() => {
          setShowGameOverDialog(true);
        }, 2000);
      }
    });
  };

  const attack = (mvDam, pokemon, opponent, isSuccessful) => {
    let updatedBattle = battle;
    let opponentNewHealth = updatedBattle[opponent.name].health - mvDam;
    if (opponentNewHealth < 0) {
      opponentNewHealth = 0;
    }
    updatedBattle[opponent.name].health = opponentNewHealth;
    updatedBattle.moves.push({
      attacker: pokemon.name,
      defender: opponent.name,
      damage: mvDam,
      success: isSuccessful,
    });
    insertBattleIntoDb({ ...updatedBattle });
  };

  const setExpForUser = async (exp) => {
    let userData = { experience: exp };
    return firebase
      .database()
      .ref("users/" + props.user.uid + "/userData")
      .update(userData);
  };

  const resetEachUsersFightingStatus = () => {
    let updateBoth = { opponent: "", status: "" };
    db.ref(
      "users/" + props.users[props.user.uid].userData.uid + "/userData"
    ).update(updateBoth);
    db.ref(
      "users/" + props.users[props.user.uid].userData.fighting + "/userData"
    ).update(updateBoth);
  };

  const calculateExperience = (pokemon, opponent) => {
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

  return (
    <Container
      maxWidth="lg"
      style={{
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        backgroundImage:
          "url('" +
          backgroundImgArray[randomNumberForBackgroundImgSelection] +
          "')",
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
                setPokemonArray={setUsersPokemonCollection}
              />
            );
          })}
      <GameOverDialog
        showGameOverDialog={showGameOverDialog}
        isGameOver={props.setTimeForBattle}
        expGainForWinner={expGainedForWinner}
        winner={winner}
      />
    </Container>
  );
}

export default BattleGround;
