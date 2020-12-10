import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, LinearProgress } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

import Grid from "@material-ui/core/Grid";
import PokemonCard from "../components/PokemonCard";
import Stats from "./Stats";
import UserList from "../components/UserList";
import firebase from "../firebaseConfig";
import Button from "@material-ui/core/Button";

const db = firebase.database();

export default function Dashboard(props) {
  const [statusOfUsers, setStatusOfUsers] = useState({});
  const [challenger, setChallenger] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    db.ref("status").on("value", (x) => {
      if (x.val()) {
        let allUsersStatuses = x.val();
        setStatusOfUsers(allUsersStatuses);
      }
    });
  }, []);

  useEffect(() => {
    let currentUser = props.users[props.user.uid];
    if (
      currentUser &&
      currentUser.userData.opponent !== "" &&
      currentUser.userData.status === "accepted" &&
      props.users[currentUser.userData.opponent].userData.status === "accepted"
    ) {
      setFightingStatusForTrainers();
      props.setTimeForBattle(true);
    }
  }, [props.users[props.user.uid]]);

  const challengeUser = (challengee) => {
    setChallenger(true);
    let updateOpponent = { status: "pending", opponent: props.user.uid };
    let updateUser = {
      status: "pending",
      opponent: challengee.userData.uid,
    };
    db.ref("users/" + challengee.userData.uid + "/userData").update(
      updateOpponent
    );
    db.ref("users/" + props.user.uid + "/userData").update(updateUser);
  };

  const acceptChallenge = () => {
    setChallenger(false);
    let updateUser = {
      status: "accepted",
    };
    db.ref("users/" + props.user.uid + "/userData").update(updateUser);
  };

  const denyChallenge = () => {
    setChallenger(false);
    let updateOpponent = { status: "", opponent: "" };
    let updateUser = { status: "", opponent: "" };
    db.ref(
      "users/" + props.users[props.user.uid].userData.opponent + "/userData"
    ).update(updateOpponent);
    db.ref("users/" + props.user.uid + "/userData").update(updateUser);
  };

  const setFightingStatusForTrainers = () => {
    console.log(props.users[props.user.uid]);
    let updateOpponent = { status: "fighting" };
    let updateUser = { status: "fighting" };
    db.ref(
      "users/" + props.users[props.user.uid].userData.opponent + "/userData"
    ).update(updateOpponent);
    db.ref("users/" + props.user.uid + "/userData").update(updateUser);
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
          <UserList
            setTimeForBattle={props.setTimeForBattle}
            statusOfUsers={statusOfUsers}
            user={props.user}
            users={props.users}
            challengeUser={challengeUser}
          />
        </Grid>
      </Grid>
      <PreBattleDialog
        challenger={challenger}
        open={
          props.users[props.user.uid] &&
          props.users[props.user.uid].userData.status === "pending"
        }
        user={props.users[props.user.uid]}
        users={props.users}
        acceptChallenge={acceptChallenge}
        denyChallenge={denyChallenge}
      />
    </div>
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
      </PokemonCard>
    </Grid>
  );
}

function PreBattleDialog(props) {
  const [open, setOpen] = React.useState(props.open);

  const handleAcceptChallenge = (value) => {
    setOpen(false);
    props.acceptChallenge();
  };

  const handleDenyChallenge = (value) => {
    setOpen(false);
    props.denyChallenge();
  };

  return (
    <Dialog
      onClose={handleDenyChallenge}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleDenyChallenge}>
        {props.challenger ? "Waiting on acceptance" : "You've been challenged!"}
      </DialogTitle>
      <DialogContent dividers>
        {props.challenger
          ? "Waiting on acceptance from"
          : "Would you like to battle"}{" "}
        <b>
          {props.user &&
            props.user.userData.opponent &&
            props.users[props.user.userData.opponent].userData.name}
        </b>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleAcceptChallenge}
          color="default"
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDenyChallenge}
        >
          Deny
        </Button>
      </DialogActions>
    </Dialog>
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
