import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  LinearProgress,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
} from "@material-ui/core";

import Pokemon from "../components/Pokemon";

import { MOVE_COUNT } from "../constants/vars";

function PokemonContainer(props) {
  const [opponent, setOpponent] = useState(props.opponent);
  const [attacking, setAttacking] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = (value) => {
    setOpen(false);
  };

  useEffect(() => {
    if (props.battle.moves) {
      console.log("moves!", props.battle.moves);
    }
  }, [props.battle.moves]);

  useEffect(() => {
    setOpponent(props.opponent);
  }, [props.opponent]);

  const style = {
    position: "absolute",
    padding: "10px",
    top: 10,
    background: "white",
    borderRadius: "5px",
    margin: "auto",
    fontWeight: 800,
    fontSize: "16px",
  };

  const statsContainer = {
    position: "absolute",
    // border: "solid 2px black",
    // margin: 60,
    padding: 20,
    fontSize: "24px",
    minWidth: "600px",
    minHeight: "100px",
    fontWeight: 700,
    background: "white",
    borderRadius: "0px 0px  5px",
    // boxShadow: "20px 20px 20px #686868, -20px -20px 20px #8c8c8c",
    zIndex: 1000,
  };

  let buttonGroupStyle = {};

  if (!props.me) {
    style.right = 10;
    statsContainer.top = 0;
    statsContainer.left = 0;
    buttonGroupStyle.left = 0;
  } else {
    style.left = 10;
    statsContainer.bottom = 0;
    statsContainer.right = 0;
    buttonGroupStyle.right = 0;
  }

  const attack = (mv, pokemon, opponent, me) => {
    let success = true;
    let pokemonArr = Object.values(props.battle);
    opponent = pokemonArr.find((p) => p.pokemon && !p.pokemon[pokemon.name]);
    setAttacking(true);
    props.attack(mv, pokemon, Object.values(opponent.pokemon)[0], success);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAttacking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [attacking]);

  return (
    <div>
      <div
        style={{
          ...statsContainer,
        }}
      >
        <ButtonGroup
          color="primary"
          size="small"
          aria-label="outlined primary button group"
        >
          {props.pokemon &&
            props.pokemon.moves &&
            props.pokemon.moves.slice(0, MOVE_COUNT).map((mv, i) => {
              return (
                <Button
                  key={props.pokemon.name + i}
                  size="small"
                  onClick={() => attack(mv, props.pokemon, opponent, props.me)}
                  disabled={
                    props.fainted ||
                    (props.battle.moves &&
                      props.battle.moves[props.battle.moves.length - 1])
                      ? props.battle.moves[props.battle.moves.length - 1]
                          .attacker === props.pokemon.name
                      : false
                  }
                >
                  {mv.move.name} - {mv.accuracy}
                </Button>
              );
            })}
        </ButtonGroup>
        <Button size="small">{props.pokemon.name}</Button>
        <div style={{ position: "absolute", width: "90%", bottom: 0 }}>
          <LinearProgressWithLabel value={props.pokemon.health} />
        </div>
      </div>
      <Pokemon
        me={props.me}
        attacking={props.attacking}
        pokemon={props.pokemon}
        i={props.me}
      />
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Missed!!!!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.pokemon.name}'s attack missed...
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" m={1}>
        <LinearProgress
          style={{ height: 10 }}
          variant="determinate"
          value={props.value ? props.value : 100}
          {...props}
        />
      </Box>
      <Box minWidth={60}>
        <Typography variant="body1" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default PokemonContainer;
