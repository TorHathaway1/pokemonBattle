import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, LinearProgress } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import PokemonCard from "../components/PokemonCard";
import PokemonStats from "../components/PokemonStats";
import UserList from "../components/UserList";
import firebase from "../firebaseConfig";
import { initializePokemonForBattle } from "../common/pokemonFunctions";

export default function PokemonDashBoard(props) {
  const [users, setUsers] = useState({});
  const classes = useStyles();
  useEffect(() => {
    getRandomPokemon();
    firebase
      .database()
      .ref("status")
      .on("value", (x) => {
        if (x.val()) {
          let user = x.val();
          setUsers(user);
        }
      });
  }, []);

  const getRandomPokemon = async () => {
    const challenger = await initializePokemonForBattle(props.pokemonArray[5]);
    console.log("CHALLENGER", challenger);
  };

  return (
    <div className={classes.root}>
      <Grid container xs={12}>
        <Grid item container xs={6}>
          {Object.values(props.usersPokemon).map((p, i) => {
            return (
              <Grid
                item
                xs={Object.keys(props.usersPokemon).length === 2 ? 6 : 12}
              >
                <PokemonCardData pokemon={p} key={p.name} />
              </Grid>
            );
          })}
        </Grid>
        <Grid item xs={6}>
          <UserList setTimeForBattle={props.setTimeForBattle} users={users} />
        </Grid>
      </Grid>
    </div>
  );
}

function PokemonCardData(props) {
  const classes = useStyles();
  let expUntilNextLevel =
    props.pokemon.species.growth_rate.levels[props.pokemon.level - 1]
      .experience /
    props.pokemon.species.growth_rate.levels[props.pokemon.level].experience;

  return (
    <Grid item xs={12} className={classes.root}>
      <PokemonCard selectPokemon={props.selectPokemon} pokemon={props.pokemon}>
        <Typography variant="h5">lvl {props.pokemon.level}</Typography>
        <LinearProgress
          style={{ width: "30%", margin: "auto" }}
          variant="determinate"
          value={expUntilNextLevel * 100}
        />
        <Typography variant="subtitle1" className={classes.title}>
          {props.pokemon.experience} exp
        </Typography>
        <Grid container>
          <PokemonStats stats={props.pokemon.stats} />
        </Grid>
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
