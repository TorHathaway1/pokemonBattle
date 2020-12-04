import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Box, Typography, Button, Container } from "@material-ui/core";
import bg from "../images/ro5bn3v.png";

import firebase from "../firebaseConfig";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  container: {
    // backgroundImage: `url(${bg})`,
    // backgroundSize: "cover",
  },
  bgImage: {
    background: `url(${bg})`,
    backgroundSize: "cover",
    height: "100vh",
    width: "100vw",
    position: "absolute",
    zIndex: -1,
    filter: "blur(10px)",
    webkitFilter: "blur(10px)",
  },
}));

export default function Login() {
  const classes = useStyles();
  var provider = new firebase.auth.GoogleAuthProvider();
  const onLogin = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (error) {
        console.log("ERR", error);
      });
  };

  return (
    <Container maxWidth={false} disableGutters className={classes.container}>
      <div className={classes.bgImage} />
      <Box display="flex" width={"100%"} height={"100vh"}>
        <Box m="auto">
          <Paper className={classes.paper}>
            <Typography variant="h2" gutterBottom>
              Pokemon Battle
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              style={{ justifyContent: "bottom" }}
              onClick={onLogin}
            >
              Login with Google
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
