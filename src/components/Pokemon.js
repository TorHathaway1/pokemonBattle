import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

export default function Pokemon(props) {
  const classes = useStyles();
  const [pokemon] = React.useState(props.pokemon);
  const [attacking, setAttacking] = React.useState(false);

  // setup pokemon assets
  React.useEffect(() => {
    // console.log("poke change", pokemon);
  }, [pokemon]);

  let opponent = {
    position: "absolute",
    left: "70vw",
    bottom: "50vh",
    height: "30vh",
  };

  let homeTeam = {
    position: "absolute",
    left: "10vw",
    bottom: "15vh",
    height: "40vh",
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAttacking(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [attacking]);

  return (
    <img
      style={props.me ? homeTeam : opponent}
      className={clsx(
        props.attacking
          ? props.me
            ? classes.attackOpponent
            : classes.opponentAttack
          : props.pokemon.health === 0
          ? classes.receiveDamage
          : null
      )}
      src={
        pokemon &&
        pokemon.sprites &&
        pokemon.sprites.versions["generation-v"] &&
        pokemon.sprites.versions["generation-v"]["black-white"].animated[
          !props.me ? "front_default" : "back_default"
        ]
          ? pokemon.sprites.versions["generation-v"]["black-white"].animated[
              !props.me ? "front_default" : "back_default"
            ]
          : pokemon.sprites
          ? pokemon.sprites[!props.me ? "front_default" : "back_default"]
          : ""
      }
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  animatedItem: {
    animation: `$enterPokemon 1000ms ${theme.transitions.easing.easeInOut}`,
  },
  animatedItemExiting: {
    animation: `$myEffectExit 1000ms ${theme.transitions.easing.easeInOut}`,
    opacity: 0,
    transform: "translateY(-200%)",
  },
  attackOpponent: {
    animation: `$attackOpponent 500ms ${theme.transitions.easing.easeInOut}`,
  },
  opponentAttack: {
    animation: `$opponentAttack 500ms ${theme.transitions.easing.easeInOut}`,
  },
  receiveDamage: {
    animation: `$receiveDamage 1000ms ${theme.transitions.easing.easeInOut}`,
  },
  "@keyframes enterPokemon": {
    "0%": {
      opacity: 0,
      transform: "translateY(-200%)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes myEffectExit": {
    "0%": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "100%": {
      opacity: 0,
      transform: "translateY(-200%)",
    },
  },
  "@keyframes attackOpponent": {
    "0%": {
      transform: "translateY(0)",
    },
    "35%": {
      transform: "translateX(50vw) translateY(-30vh)",
    },
    "50%": {
      transform: "translateX(50vw) translateY(-30vh)",
      height: "30vh",
    },
    "85%": {
      transform: "translateX(50vw) translateY(-30vh)",
    },
    "100%": {
      transform: "translateX(0%) translateY(0%)",
    },
  },
  "@keyframes receiveDamage": {
    "0%": {
      opacity: 1,
    },
    "15%": {
      opacity: 0.3,
    },
    "35%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.3,
    },
    "65%": {
      opacity: 1,
    },
    "85%": {
      opacity: 0.3,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes opponentAttack": {
    "0%": {
      transform: "translateX(0vw) translateY(0)",
    },
    "35%": {
      transform: "translateX(-55vw) translateY(20vh)",
    },
    "50%": {
      transform: "translateX(-55vw) translateY(20vh)",
      height: "50vh",
    },
    "85%": {
      transform: "translateX(-55vw) translateY(20vh)",
      height: "50vh",
    },
    "100%": {
      transform: "translateX(0%) translateY(0%)",
    },
  },
}));
