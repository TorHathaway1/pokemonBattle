import React from "react";
import Dialog from "@material-ui/core/Dialog";
import PokemonCard from "./PokemonCard";
import Grid from "@material-ui/core/Grid";
import {
  LinearProgress,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import Stats from "./Stats";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebaseConfig";

export default function PokemonDialog(props) {
  const handleClose = () => {
    props.setShowPokemon(null);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <PokemonCardData
        pokemon={props.pokemon}
        user={props.user}
        handleClose={handleClose}
      />
    </Dialog>
  );
}

function PokemonCardData(props) {
  const classes = useStyles();
  const pokemonGrowthRateLevels = props.pokemon.species.growth_rate.levels;
  const pokemonLevel = props.pokemon.level;
  let expNeededForCurrLevel =
    pokemonGrowthRateLevels[pokemonLevel - 1].experience;
  let expNeededForNextLevel = pokemonGrowthRateLevels[pokemonLevel].experience;
  let totalExpForPokemon =
    props.pokemon.experience + props.pokemon.base_experience;

  let totalEXPNeededToLevelUp = expNeededForNextLevel - expNeededForCurrLevel;
  let totalEXPGainedSinceLastLevelUp =
    totalExpForPokemon - expNeededForCurrLevel;

  const deletePokemonFromUsersCollection = (pokemon) => {
    console.log("deleting", pokemon, props.user);
    var database = firebase
      .database()
      .ref("users/" + props.user.userData.uid + "/pokemon/" + pokemon.name);
    database.remove();
  };

  return (
    <Grid item xs={12} className={classes.root}>
      <PokemonCard selectPokemon={props.selectPokemon} pokemon={props.pokemon}>
        <Typography variant="h5">lvl {props.pokemon.level}</Typography>
        <LinearProgress
          style={{ width: "40%", margin: "auto" }}
          variant="determinate"
          value={
            (totalEXPGainedSinceLastLevelUp / totalEXPNeededToLevelUp) * 100
          }
        />
        <Typography variant="subtitle1" className={classes.title}>
          {totalExpForPokemon} exp
        </Typography>
        <Grid container>
          <Stats stats={props.pokemon.stats} />
        </Grid>
        <CardActions>
          <Button
            size="large"
            variant={"outlined"}
            style={{ marginLeft: "auto" }}
            color="secondary"
            onClick={() => deletePokemonFromUsersCollection(props.pokemon)}
          >
            Remove
          </Button>
        </CardActions>
      </PokemonCard>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
    margin: "auto",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));
