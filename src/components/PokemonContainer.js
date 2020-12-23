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
  Avatar,
  SvgIcon,
  CardHeader,
  Grid,
} from "@material-ui/core";

import Pokemon from "../components/Pokemon";
import PokemonAvatar from "./PokemonAvatar";

import { MOVE_COUNT } from "../constants/vars";
import { renderUserAvatarIcon } from "../common/userFunctions";
import { makeStyles } from "@material-ui/core/styles";
import AdbIcon from "@material-ui/icons/Adb";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
  },
  largeAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  pokemonAvatar: {
    margin: theme.spacing(1),
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
}));

function PokemonContainer(props) {
  const classes = useStyles();
  const [opponent, setOpponent] = useState(props.opponent);
  const [attacking, setAttacking] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

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
    padding: 20,
    fontSize: "24px",
    minWidth: "600px",
    minHeight: "100px",
    fontWeight: 700,
    background: "white",
    borderRadius: "0px 0px  5px",
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

  if (props.user) {
    console.log("props.user", props.user.pokemon);
  }

  return (
    <div>
      <div style={statsContainer}>
        <div style={{ padding: 10, display: "inlineBlock" }}>
          <Avatar
            className={classes.largeAvatar}
            onClick={() => null}
            variant={"square"}
            style={{ display: "inline-block" }}
          >
            {props.user === undefined ? (
              <AdbIcon style={{ fontSize: "2.25rem" }} />
            ) : (
              <SvgIcon style={{ fontSize: "3rem" }}>
                {renderUserAvatarIcon(props.user, "large")}
              </SvgIcon>
            )}
          </Avatar>
          {props.user ? props.user.userData.name : "Bot"}
          <div
            style={{
              padding: 10,
              display: "inline-block",
              background: "lightBlue",
              borderRadius: "5px",
              marginLeft: 10,
            }}
          >
            {props.user &&
              Object.values(props.user.pokemon).map((p, i) => {
                return (
                  <PokemonAvatar
                    small
                    displayInline
                    pokemon={p}
                    setShowPokemon={(p) => console.log(p)}
                  />
                );
              })}
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <Typography variant={"h6"}>{props.pokemon.name}</Typography>
          <Typography variant={"subtitle1"}>{props.pokemon.level}</Typography>
          <MoveButtons
            attack={attack}
            fainted={props.fainted}
            battle={props.battle}
            pokemon={props.pokemon}
            opponent={props.opponent}
            me={props.me}
          />
          <div style={{ position: "absolute", width: "90%", bottom: 0 }}>
            <LinearProgressWithLabel value={props.pokemon.health} />
          </div>
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

const MoveButtons = (props) => {
  return (
    <ButtonGroup
      variant="contained"
      color="primary"
      size="small"
      aria-label="outlined primary button group"
    >
      {props.pokemon &&
        props.pokemon.moves.slice(0, MOVE_COUNT).map((mv, i) => {
          return (
            <Button
              key={mv.name + i}
              onClick={() =>
                props.attack(mv, props.pokemon, props.opponent, props.me)
              }
              disabled={
                props.fainted ||
                (props.battle.moves &&
                  props.battle.moves[props.battle.moves.length - 1])
                  ? props.battle.moves[props.battle.moves.length - 1]
                      .attacker === props.pokemon.name
                  : false
              }
            >
              {mv.move.name}
            </Button>
          );
        })}
    </ButtonGroup>
  );
};

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
