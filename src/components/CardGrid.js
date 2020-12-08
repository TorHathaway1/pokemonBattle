import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PokemonCard from "./PokemonCard";

export default function CardGrid(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        {props.pokemonArray.map((p, i) => {
          return (
            <Grid item key={i} xs={3}>
              <PokemonCard selectPokemon={props.selectPokemon} pokemon={p} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
