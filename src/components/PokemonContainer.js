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

import { MOVE_COUNT } from "../constants/pokeVars";

function PokemonContainer(props) {
  const [opponent, setOpponent] = useState(null);
  const [attacking, setAttacking] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = (value) => {
    setOpen(false);
  };

  useEffect(() => {
    let opponent;
    Object.values(props.battle)
      .slice(0, 2)
      .forEach((p, i) => {
        if (p.name !== props.pokemon.name) {
          opponent = p;
        }
      });
    setOpponent(opponent);
  }, [props.pokemon]);

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
    border: "solid 2px black",
    margin: 60,
    padding: 20,
    fontSize: "24px",
    minWidth: "600px",
    minHeight: "100px",
    fontWeight: 700,
    background: "white",
    borderRadius: "5px",
    boxShadow: "20px 20px 20px #686868, -20px -20px 20px #8c8c8c",
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

  const attack = (mv, pokemon, opponent) => {
    let success = true;
    let mvDam = calculateDamage(mv, pokemon, opponent);
    setAttacking(true);
    props.attack(mvDam, pokemon, opponent, success);
  };

  const calculateDamage = (mv, pokemon, opponent) => {
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

    console.log(damage + " damage dealt.");

    return damage;
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
          {props.pokemon.moves.slice(0, MOVE_COUNT).map((mv, i) => {
            return (
              <Button
                key={props.pokemon.name + i}
                size="small"
                onClick={() => attack(mv, props.pokemon, opponent)}
                disabled={
                  props.fainted ||
                  props.battle.moves[props.battle.moves.length - 1]
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
        <Button size="small" onClick={() => props.setSelectedPokemon([])}>
          {props.pokemon.name}
        </Button>
        <div style={{ position: "absolute", width: "90%", bottom: 0 }}>
          <LinearProgressWithLabel value={props.pokemon.health} />
        </div>
      </div>
      <Pokemon
        me={props.me}
        attacking={attacking}
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
      <Box width="100%" mr={1}>
        <LinearProgress
          style={{ height: 10 }}
          variant="determinate"
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
