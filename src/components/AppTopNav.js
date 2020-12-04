import React, { useEffect, useState } from "react";
import axios from "axios";
import firebase from "../firebaseConfig";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Avatar,
  Button,
  Chip,
} from "@material-ui/core";

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

export default function AppTopNav(props) {
  const { large, medium, title } = useStyles();
  return (
    <AppBar style={{ background: "white", color: "black" }} position="fixed">
      <Toolbar>
        <Avatar className={medium} src={props.user && props.user.photoURL} />
        <Typography variant="h6" className={title}>
          {props.user && props.user.displayName}
        </Typography>
        {Object.values(props.usersPokemon)
          .splice(0, 3)
          .map((p, i) => {
            return (
              <Avatar
                onClick={() => props.deletePokemon(p)}
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
        {Object.values(props.usersPokemon).length === 2 && (
          <Button
            color="secondary"
            variant={"outlined"}
            onClick={() => props.setTimeForBattle(true)}
          >
            Fight
          </Button>
        )}
        <IconButton color="inherit" onClick={() => props.logout()}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
