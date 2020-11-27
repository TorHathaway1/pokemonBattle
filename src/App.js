import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./Theme"
import firebase from "./firebaseConfig";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
          console.log("success");
          // Sign-out successful.
        })
        .catch(function (error) {
          // An error happened.
          console.log("error");
        });
  };

  return (
    <React.Fragment>
      <CssBaseline />
        <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          {authenticated && (
              <>
            <Route
              exact
              path="/"
              render={(props) => <Home {...props} user={user} logout={logout} />}
            />
            <Route
            exact
            path="/battle"
            render={(props) => <Home {...props} user={user} logout={logout} />}
            />
            </>
          )}
          <Route exact path="/" render={(props) => <Login />} />
        </Switch>
      </Router>
        </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
