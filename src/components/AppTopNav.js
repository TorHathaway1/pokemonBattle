import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  LinearProgress,
} from "@material-ui/core";
import firebase from "../firebaseConfig";

export default function AppTopNav(props) {
  const { large, medium, title } = useStyles();

  const deletePokemonFromUsersCollection = (pokemon) => {
    var database = firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon/" + pokemon.name);
    database.remove();
  };

  return (
    <AppBar style={{ background: "white", color: "black" }} position="fixed">
      <Toolbar>
        <Avatar className={medium} src={props.user && props.user.photoURL} />
        <Typography variant="h6" className={title}>
          {props.user && props.user.displayName}
        </Typography>
        {/*<div className={title}>*/}
        {/*  <LinearProgress className={title} variant="determinate" value={50} />*/}
        {/*</div>*/}
        {Object.values(props.usersPokemon)
          .splice(0, 3)
          .map((p, i) => {
            return (
              <Avatar
                onClick={() => deletePokemonFromUsersCollection(p)}
                key={p.name}
                alt={p.name}
                className={large}
                src={
                  Object.values(props.usersPokemon)[i].sprites.other[
                    "official-artwork"
                  ].front_default
                }
              />
            );
          })}
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
