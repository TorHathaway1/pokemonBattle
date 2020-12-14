import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";

import PokemonContainer from "../components/PokemonContainer";
import GameOverDialog from "../components/GameOverDialog";
import {
  calculatePokemonLevel,
  calculateExperience,
  initializePokemonForBattle,
  calculateDamage,
} from "../common/pokemonFunctions";
import { backgroundImgArray } from "../constants/vars";
import firebase from "../firebaseConfig";

const randomNumberForBackgroundImgSelection = Math.ceil(
  Math.random() * backgroundImgArray.length - 1
);

const db = firebase.database();

function BattleGround(props) {
  const [usersPokemonCollection, setUsersPokemonCollection] = useState(
    props.selectedPokemon
  );
  const [battle, setBattle] = useState({});
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [expGainedForWinner, setExpGainForWinner] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    initializeFirebaseBattleListener();
  }, [usersPokemonCollection && props.timeForBattle]);

  useEffect(() => {
    gameOver();
  }, [battle]);

  const insertBattleIntoDb = async (battle) => {
    return db
      .ref("battles/" + props.users[props.user.uid].userData.battleUID)
      .set(battle);
  };

  const initializeFirebaseBattleListener = () => {
    let battleRef = firebase
      .database()
      .ref("battles/" + props.users[props.user.uid].userData.battleUID);
    battleRef.on("value", (snapshot) => {
      let updatedBattle = snapshot.val();
      if (updatedBattle) {
        setBattle(updatedBattle);
      }
    });
  };

  const attack = (move, pokemon, opponent, isSuccessful, isMe) => {
    let currentBattle = battle;
    let moveDamage = calculateDamage(move, pokemon, opponent);
    let opponentNewHealth =
      currentBattle[opponent.trainerUID].pokemon[opponent.name].health -
      moveDamage;
    if (opponentNewHealth <= 0) {
      opponentNewHealth = 0;
    }
    currentBattle[opponent.trainerUID].pokemon[
      opponent.name
    ].health = opponentNewHealth;
    if (currentBattle.moves === undefined) {
      currentBattle.moves = [];
    }
    currentBattle.moves.push({
      attacker: pokemon.name,
      defender: opponent.name,
      damage: moveDamage,
      success: isSuccessful,
    });

    insertBattleIntoDb(currentBattle);
  };

  const gameOver = () => {
    let pokemonInBattle = Object.values(battle);

    let currentPokemon = pokemonInBattle.map((x) =>
      !Array.isArray(x) ? x.pokemon : null
    );
    let loserIndex = currentPokemon.findIndex((x) => x && x.health === 0);
    let winnerIndex = currentPokemon.findIndex((x) => x && x.health !== 0);

    currentPokemon.map(async (p, i) => {
      if (p && Object.values(p)[0].health === 0) {
        let loser = Object.values(p)[0];
        resetEachUsersFightingStatus();
        let expGained = calculateExperience(currentPokemon[winnerIndex], loser);
        setExpGainForWinner(expGained);
        setWinner(props.selectedPokemon[winnerIndex]);
        props.selectedPokemon[winnerIndex].experience =
          props.selectedPokemon[winnerIndex].experience + expGained;

        props.selectedPokemon[winnerIndex].level = await calculatePokemonLevel(
          props.selectedPokemon[winnerIndex]
        );
        props.setPokemonForUser(props.selectedPokemon[winnerIndex]);
        setExpForUser(props.selectedPokemon[winnerIndex].trainerUID, expGained);
        setTimeout(() => {
          setShowGameOverDialog(true);
        }, 2000);
      }
    });
  };

  const setExpForUser = async (userUID, exp) => {
    let updatedUserExperience = props.users[userUID].userData.experience + exp;
    let userData = { experience: updatedUserExperience };
    return firebase
      .database()
      .ref("users/" + userUID + "/userData")
      .update(userData);
  };

  const resetEachUsersFightingStatus = () => {
    let updateBoth = { opponent: "", status: "", battleUID: "" };
    db.ref(
      "users/" + props.users[props.user.uid].userData.uid + "/userData"
    ).update(updateBoth);
    // db.ref(
    //   "users/" + props.users[props.user.uid].userData.fighting + "/userData"
    // ).update(updateBoth);
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
      {Object.values(battle).map((user, i) => {
        if (Object.keys(battle)[i] === "moves") {
          return null;
        }
        let pokemonName = Object.keys(user.pokemon)[0];
        let pokemon = user.pokemon[pokemonName];
        let usersID = Object.keys(battle)[i];
        let itsMe = usersID === props.user.uid;
        let pokemonArr = Object.values(battle).slice(0, 2);
        let opponent = pokemonArr.find((p) => p.name !== pokemon.name);

        return (
          <PokemonContainer
            me={itsMe}
            pokemonTypes={props.pokemonTypes}
            key={pokemon.name}
            attack={attack}
            battle={battle}
            pokemon={pokemon}
            opponent={opponent}
            fainted={pokemon.health === 0}
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
