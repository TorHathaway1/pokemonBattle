import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  SvgIcon,
} from "@material-ui/core";
import firebase from "../firebaseConfig";

import pokeBall from "../images/pokeball.png";

export default function AppTopNav(props) {
  const { large, medium, title } = useStyles();

  const deletePokemonFromUsersCollection = (pokemon) => {
    console.log("deleting", pokemon);
    var database = firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon/" + pokemon.name);
    database.remove();
  };

  return (
    <AppBar style={{ background: "white", color: "black" }} position="fixed">
      <Toolbar>
        <Avatar className={medium} src={pokeBall} />
        <Typography variant="h4" className={title}>
          PokeBattle
        </Typography>
        <Button
          variant={"outlined"}
          color={"secondary"}
          onClick={() => props.logout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
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
