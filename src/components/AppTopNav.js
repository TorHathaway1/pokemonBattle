import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Avatar, Button } from "@material-ui/core";
import firebase from "../firebaseConfig";

import { renderUserAvatar } from "../common/userFunctions";

export default function AppTopNav(props) {
  const { large, medium, title } = useStyles();

  const deletePokemonFromUsersCollection = (pokemon) => {
    var database = firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon/" + pokemon.name);
    database.remove();
  };

  console.log("props.user", props.user);

  return (
    <AppBar style={{ background: "white", color: "black" }} position="fixed">
      <Toolbar>
        {/*<Avatar className={medium} src={props.user && props.userPhoto} />*/}
        <Avatar className={medium} src={renderUserAvatar(props.user)} />
        <Typography variant="h6" className={title}>
          {props.user && props.user.userData.name}
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
