import React, {useEffect, useState} from "react";
import axios from "axios";
import firebase from "../firebaseConfig";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
    Box,
} from "@material-ui/core";

import PokemonCardGrid from "../components/PokemonCardGrid"
import AppTopNav from "../components/AppTopNav";
import PokemonDashboard from "../components/PokemonDashboard";
import BattleGround from "./BattleGround";

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
  const [usersPokemon, setUsersPokemon] = useState({})
  const [battle, setBattle] = useState(false)

  useEffect(() => {
    fetchAllPokemon(20);
    var pokemon = firebase.database().ref('users/' + props.user.uid + '/pokemon');
    pokemon.on('value', (snapshot) =>{
      const data = snapshot.val();
      if(data){
        setUsersPokemon(data);
      }
    });
  }, []);


  const fetchAllPokemon = (counter) => {
    setPokemonArray([]);
    axios
        .get(
            process.env.REACT_APP_POKEMON_API +
            "/pokemon?limit=12&offset=" +
            counter
        )
        .then((response) => {
          response.data.results.forEach((p, i) => {
            fetchPokemonData(p.name)
                .then((r) => {
                  let p = { ...r.data, health: 100, selected: false };
                  setPokemonArray((pArray) => [...pArray, p]);
                })
                .catch(function (error) {
                  console.log(error);
                });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
  };

  const fetchPokemonData = (pokemonName) => {
    return axios.get(
        process.env.REACT_APP_POKEMON_API + "/pokemon/" + pokemonName
    );
  };

  const selectPokemon = (pokemon) => {
    console.log(pokemon)

    var database = firebase.database().ref('users/' + props.user.uid + '/pokemon/' + pokemon.name).set(pokemon)
  }

  const deletePokemon = (pokemon) => {
    var database = firebase.database().ref('users/' + props.user.uid + '/pokemon/' + pokemon.name)
    database.remove()
  }


  return (
    <Container maxWidth={false} disableGutters>
      {!battle && <AppTopNav
          user={props.user}
          usersPokemon={usersPokemon}
          deletePokemon={deletePokemon}
          setBattle={setBattle}
          logout={props.logout}/>}
      {!battle &&
      <Box mt={8} p={3}>
        {!battle  && Object.values(usersPokemon).length < 2 &&
          <PokemonCardGrid selectPokemon={selectPokemon} usersPokemon={usersPokemon} pokemonArray={pokemonArray}/>
        }
        {!battle && usersPokemon &&
          <PokemonDashboard usersPokemon={usersPokemon} selectPokemon={props.selectPokemon}/>
        }
      </Box>
      }
      {battle &&
        <BattleGround selectedPokemon={Object.values(usersPokemon)} />
      }

    </Container>
  );
}

