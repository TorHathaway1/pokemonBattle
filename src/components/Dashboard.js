import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import UserList from "../components/UserList";
import PreBattleDialog from "../components/PreBattleDialogue";
import firebase from "../firebaseConfig";

import { initializePokemonForBattle } from "../common/pokemonFunctions";
import TrainerCard from "./TrainerCard";
import PokemonDialog from "./PokemonDialog";
import bg from "../images/pokemon_map_bg.png";

const db = firebase.database();
const ACCEPTED = "accepted";

export default function Dashboard(props) {
  const classes = useStyles();
  const [statusOfUsers, setStatusOfUsers] = useState({});
  const [challenger, setChallenger] = useState(false);
  const [showPokemon, setShowPokemon] = useState(null);
  const [showTrainer, setShowTrainer] = useState(null);

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
      currentUser.userData.status === ACCEPTED &&
      props.users[currentUser.userData.opponent].userData.status === ACCEPTED
    ) {
      setFightingStatusForTrainer(
        props.users[props.user.uid].userData.opponent
      );
      setFightingStatusForTrainer(props.user.uid);
      props.setTimeForBattle(true);
    }
  }, [props.users[props.user.uid]]);

  const challengeUser = async (challengee) => {
    setChallenger(true);
    const battleKey = await createAndInsertP2PBattleIntoDB(challengee);
    let updateOpponent = {
      status: "pending",
      opponent: props.user.uid,
      battleUID: battleKey,
    };
    let updateUser = {
      status: "pending",
      opponent: challengee.userData.uid,
      battleUID: battleKey,
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
    db.ref("battles/" + props.users[props.user.uid].userData.battleUID)
      .remove()
      .then((response) => {
        console.log("deleted");
      });
    setChallenger(false);
    let updateOpponent = { status: "", opponent: "", battleUID: "" };
    let updateUser = { status: "", opponent: "", battleUID: "" };
    db.ref(
      "users/" + props.users[props.user.uid].userData.opponent + "/userData"
    ).update(updateOpponent);
    db.ref("users/" + props.user.uid + "/userData").update(updateUser);
  };

  const setFightingStatusForTrainer = (userUID) => {
    let updateUser = { status: "fighting" };
    db.ref("users/" + userUID + "/userData").update(updateUser);
  };

  const createAndInsertP2PBattleIntoDB = (challengee) => {
    let battle = {
      [props.users[props.user.uid].userData.uid]: props.users[props.user.uid],
      [challengee.userData.uid]: challengee,
    };
    let battleRef = db.ref("battles/").push();
    battleRef.set(battle);
    return battleRef.key;
  };

  const challengeBot = async () => {
    let randomPokemon = props.pokemonArray[Math.ceil(Math.random() * 20)];
    let initializedPokemon = await initializePokemonForBattle(randomPokemon);
    const botBattleUID = createAndInsertP2PBattleIntoDB({
      pokemon: {
        [initializedPokemon.name]: { ...initializedPokemon, trainerUID: "bot" },
      },
      userData: { uid: "bot" },
    });
    let updateUser = { battleUID: botBattleUID };
    setFightingStatusForTrainer(props.user.uid);
    db.ref("users/" + props.user.uid + "/userData").update(updateUser);
    props.setTimeForBattle(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.bgImage} />
      <Grid item={true} container xs={12}>
        <Grid item container xs={6}>
          {props.users && props.users[props.user.uid] && (
            <TrainerCard
              user={props.users[props.user.uid]}
              setEditAvatar={props.setEditAvatar}
              setShowPokemon={setShowPokemon}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <UserList
            statusOfUsers={statusOfUsers}
            user={props.user}
            users={props.users}
            challengeUser={challengeUser}
            challengeBot={challengeBot}
            setTimeForBattle={props.setTimeForBattle}
            setShowTrainer={setShowTrainer}
          />
        </Grid>
        {showPokemon && props.users[props.user.uid] && (
          <PokemonDialog
            open={showPokemon}
            pokemon={showPokemon}
            setShowPokemon={setShowPokemon}
            user={props.users[props.user.uid]}
          />
        )}
      </Grid>
      <PreBattleDialog
        challenger={challenger}
        open={
          props.users[props.user.uid] &&
          props.users[props.user.uid].userData &&
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
  bgImage: {
    // background: "lightgray",
  },
}));
