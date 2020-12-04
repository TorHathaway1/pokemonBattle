import React, { useEffect, useState } from "react";
import axios from "axios";
import firebase from "../firebaseConfig";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Box } from "@material-ui/core";

import PokemonCardGrid from "../components/PokemonCardGrid";
import AppTopNav from "../components/AppTopNav";
import PokemonDashboard from "../components/PokemonDashboard";
import BattleGround from "./BattleGround";

import { initializePokemonForBattle } from "../common/pokemonFunctions";

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

export default function Home(props) {
  const classes = useStyles();
  const [pokemonArray, setPokemonArray] = useState([]);
  const [usersPokemon, setUsersPokemon] = useState({});
  const [pokemonTypes, setPokemonTypes] = useState([]);

  const [timeForBattle, setTimeForBattle] = useState(false);

  useEffect(() => {
    fetchAllTypes();
    fetchPokemon(20, Math.ceil(Math.random() * 500));
    var pokemon = firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon");
    pokemon.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsersPokemon(data);
      } else {
        setUsersPokemon({});
      }
    });
  }, []);

  // set user as online
  useEffect(() => {
    setUserState();
  }, []);

  const setUserState = () => {
    var uid = firebase.auth().currentUser.uid;
    var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
    var isOfflineForDatabase = {
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
      state: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    firebase
      .database()
      .ref(".info/connected")
      .on("value", function (snapshot) {
        if (snapshot.val() === false) {
          return;
        }
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(function () {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  };

  const logout = () => {
    setUserState();
    props.logout();
  };

  const fetchPokemon = async (limit, offset) => {
    setPokemonArray([]);
    const pokemonList = await fetchPokemonList(limit, offset);
    pokemonList.forEach((p, i) => {
      fetchPokemonData(p.name).then((r) => {
        let p = {
          ...r.data,
          moves: r.data.moves.splice(0, 5),
          health: 100,
          selected: false,
          experience: 0,
          level: 1,
        };
        setPokemonArray((pArray) => [...pArray, p]);
      });
    });
  };

  const fetchPokemonList = async (limit, offset) => {
    return axios
      .get(
        process.env.REACT_APP_POKEMON_API +
          "/pokemon?limit=" +
          limit +
          "&offset=" +
          offset
      )
      .then((result) => {
        return result.data.results;
      });
  };

  const fetchAllTypes = () => {
    let tempTypes = pokemonTypes;
    let promises = [];
    for (var i = 1; i < 18; i++) {
      promises.push(
        fetchType(i).then((response) => {
          tempTypes.push({
            ...response.data,
            type: { name: response.data.name },
          });
        })
      );
    }

    Promise.all(promises).then(() => setPokemonTypes(tempTypes));
  };

  const fetchType = (id) => {
    return axios.get(process.env.REACT_APP_POKEMON_API + "/type/" + id);
  };

  const fetchPokemonData = (pokemonName) => {
    return axios.get(
      process.env.REACT_APP_POKEMON_API + "/pokemon/" + pokemonName
    );
  };

  const selectPokemon = async (pokemon) => {
    let p = await initializePokemonForBattle(pokemon);
    setPokemonForUser(p);
  };

  const setPokemonForUser = async (pokemon) => {
    return firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon/" + pokemon.name)
      .set(pokemon);
  };
  const setExpForUser = async (exp) => {
    let userData = { experience: exp };
    return firebase
      .database()
      .ref("users/" + props.user.uid + "/userData")
      .set(userData);
  };

  const deletePokemon = (pokemon) => {
    var database = firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon/" + pokemon.name);
    database.remove();
  };

  const getRandomPokemon = async () => {
    const challenger = await initializePokemonForBattle(props.pokemonArray[5]);
    console.log("CHALLENGER", challenger);
  };

  return (
    <Container maxWidth={false} disableGutters>
      {!timeForBattle && (
        <>
          <AppTopNav
            user={props.user}
            usersPokemon={usersPokemon}
            deletePokemon={deletePokemon}
            setTimeForBattle={setTimeForBattle}
            logout={logout}
          />
          <Box mt={8} p={3}>
            {!timeForBattle && Object.values(usersPokemon).length < 2 && (
              <PokemonCardGrid
                selectPokemon={selectPokemon}
                usersPokemon={usersPokemon}
                pokemonArray={pokemonArray}
              />
            )}
            {Object.values(usersPokemon).length === 2 && (
              <PokemonDashboard
                pokemonArray={pokemonArray}
                usersPokemon={usersPokemon}
                selectPokemon={props.selectPokemon}
                setTimeForBattle={setTimeForBattle}
                user={props.user}
              />
            )}
          </Box>
        </>
      )}
      {timeForBattle && Object.values(usersPokemon).length > 1 && (
        <BattleGround
          timeForBattle={timeForBattle}
          setTimeForBattle={setTimeForBattle}
          setPokemonForUser={setPokemonForUser}
          setExpForUser={setExpForUser}
          selectedPokemon={Object.values(usersPokemon)}
          pokemonTypes={pokemonTypes}
        />
      )}
    </Container>
  );
}
