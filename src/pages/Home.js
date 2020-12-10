import React, { useEffect, useState } from "react";
import axios from "axios";
import firebase from "../firebaseConfig";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Box } from "@material-ui/core";

import CardGrid from "../components/CardGrid";
import AppTopNav from "../components/AppTopNav";
import PokemonDashboard from "../components/Dashboard";
import BattleGround from "./BattleGround";

import { initializePokemonForBattle } from "../common/pokemonFunctions";
import { setUserOnlineStatus } from "../common/firebaseFunctions";
import {
  maximumNumberOfPokemon,
  sizeOfPokemonGroupFetched,
  totalNumberOfPokemonTypes,
} from "../constants/vars";

export default function Home(props) {
  const [pokemonArray, setPokemonArray] = useState([]);
  const [usersPokemonCollection, setUsersPokemonCollection] = useState({});
  const [allPokemonTypes, setAllPokemonTypes] = useState([]);
  const [timeForBattle, setTimeForBattle] = useState(false);
  const [users, setUsers] = useState({});

  const randomPokemonIDToStartGroupFrom = Math.ceil(
    Math.random() * maximumNumberOfPokemon
  );

  // fires once
  useEffect(() => {
    setUserInfomation();
    setUserOnlineStatus();
    fetchAllPokemonTypes();
    fetchAndSetDataForPokemonArray(
      randomPokemonIDToStartGroupFrom,
      sizeOfPokemonGroupFetched
    );
    setupPokemonFirebaseListener();
    setupPokemonUsersListener();
  }, []);

  const setUserInfomation = async (exp) => {
    let userData = {
      name: firebase.auth().currentUser.displayName,
      hp: 100,
      experience: 0,
      uid: firebase.auth().currentUser.uid,
      status: "",
      opponent: "",
    };
    return firebase
      .database()
      .ref("users/" + props.user.uid + "/userData")
      .update(userData);
  };

  const fetchAllPokemonTypes = () => {
    let tempTypes = allPokemonTypes;
    let promises = [];
    for (var id = 1; id < totalNumberOfPokemonTypes; id++) {
      promises.push(
        fetchTypeRequest(id).then((response) => {
          tempTypes.push({
            ...response.data,
            type: { name: response.data.name },
          });
        })
      );
    }
    Promise.all(promises).then(() => setAllPokemonTypes(tempTypes));
  };

  const fetchTypeRequest = (id) => {
    return axios.get(process.env.REACT_APP_POKEMON_API + "/type/" + id);
  };

  const fetchAndSetDataForPokemonArray = async (startingAtID, groupSize) => {
    let promises = [];
    setPokemonArray([]);
    let tempPokemonArray = [];
    const arrayOfPokemonNames = await fetchArrayOfPokemonNames(
      startingAtID,
      groupSize
    );
    arrayOfPokemonNames.forEach((p, i) => {
      promises.push(
        fetchPokemonDataRequest(p.name).then((pokemon) => {
          tempPokemonArray.push(addBaseStatsToPokemon(pokemon));
        })
      );
    });
    Promise.all(promises).then(() => setPokemonArray(tempPokemonArray));
  };

  const fetchArrayOfPokemonNames = async (startingAtID, groupSize) => {
    return axios
      .get(
        process.env.REACT_APP_POKEMON_API +
          "/pokemon?limit=" +
          groupSize +
          "&offset=" +
          startingAtID
      )
      .then((result) => {
        return result.data.results;
      });
  };

  const addBaseStatsToPokemon = (pokemon) => {
    return {
      ...pokemon,
      moves: pokemon.moves.splice(0, 5),
      health: 100,
      selected: false,
      experience: 0,
      level: 1,
    };
  };

  const fetchPokemonDataRequest = (pokemonName) => {
    return axios
      .get(process.env.REACT_APP_POKEMON_API + "/pokemon/" + pokemonName)
      .then((response) => {
        return response.data;
      });
  };

  const selectPokemonInDashboard = async (pokemon) => {
    let initializedPokemon = await initializePokemonForBattle(pokemon);
    addPokemonToUserInFirebase(initializedPokemon);
  };

  const addPokemonToUserInFirebase = async (pokemon) => {
    return firebase
      .database()
      .ref("users/" + props.user.uid + "/pokemon/" + pokemon.name)
      .set(pokemon);
  };

  const setupPokemonFirebaseListener = () => {
    var usersPokemonCollectionFirebaseConnection = firebase
      .database()
      .ref("users/" + props.user.uid);
    usersPokemonCollectionFirebaseConnection.on("value", (snapshot) => {
      if (snapshot.val()) {
        const data = snapshot.val();
        setUsersPokemonCollection(data.pokemon);
      } else {
        setUsersPokemonCollection({});
      }
    });
  };

  const setupPokemonUsersListener = () => {
    var usersPokemonCollectionFirebaseConnection = firebase
      .database()
      .ref("users");
    usersPokemonCollectionFirebaseConnection.on("value", (snapshot) => {
      if (snapshot.val()) {
        const users = snapshot.val();
        setUsers(users);
      } else {
        setUsers({});
      }
    });
  };

  return (
    <Container maxWidth={false} disableGutters>
      {!timeForBattle && (
        <>
          <AppTopNav
            user={props.user}
            usersPokemon={usersPokemonCollection}
            setTimeForBattle={setTimeForBattle}
            logout={props.logout}
          />
          <Box mt={8} p={3}>
            {!timeForBattle &&
              Object.values(usersPokemonCollection).length < 2 && (
                <CardGrid
                  selectPokemon={selectPokemonInDashboard}
                  usersPokemon={usersPokemonCollection}
                  pokemonArray={pokemonArray}
                />
              )}
            {Object.values(usersPokemonCollection).length === 2 && (
              <PokemonDashboard
                usersPokemon={usersPokemonCollection}
                selectPokemon={props.selectPokemon}
                setTimeForBattle={setTimeForBattle}
                user={props.user}
                users={users}
              />
            )}
          </Box>
        </>
      )}
      {timeForBattle && Object.values(usersPokemonCollection).length > 1 && (
        <BattleGround
          timeForBattle={timeForBattle}
          setTimeForBattle={setTimeForBattle}
          setPokemonForUser={addPokemonToUserInFirebase}
          selectedPokemon={Object.values(usersPokemonCollection)}
          pokemonTypes={allPokemonTypes}
          user={props.user}
          users={users}
        />
      )}
    </Container>
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
