import React, {useState, useEffect} from "react";
import {Container, Typography, Box, Button, LinearProgress, ButtonGroup} from "@material-ui/core";

import Pokemon from "../components/Pokemon";
import axios from "axios";

const bgs = [
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d83i5qk-329cf19f-2025-4333-b2b2-7a3400e07d94.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODNpNXFrLTMyOWNmMTlmLTIwMjUtNDMzMy1iMmIyLTdhMzQwMGUwN2Q5NC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.gbcaaHz3bl2NOpGWmk1VXkr9DYL2NB-VRui6XW5IYdA",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d874gjl-59e79083-fec5-4234-8879-2aa8afd7f9f4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODc0Z2psLTU5ZTc5MDgzLWZlYzUtNDIzNC04ODc5LTJhYThhZmQ3ZjlmNC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.UMFdXoCcqHSZ0U3dFWt8351ncIACJOCM9Zrb_tBzx90",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d88wyk1-5825bbcc-0104-4317-b743-065122db1d15.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODh3eWsxLTU4MjViYmNjLTAxMDQtNDMxNy1iNzQzLTA2NTEyMmRiMWQxNS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.WmlHYwGcmpuhFePCOSjIY3V1905aGVFeiXVGtBxL_iM",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d8937eq-0475612f-9da7-482c-b3db-f481329d5a53.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODkzN2VxLTA0NzU2MTJmLTlkYTctNDgyYy1iM2RiLWY0ODEzMjlkNWE1My5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.KznpC3PU2uS0MyT5FtlS2qAneA8xWanUZBNuteEbadk",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d87700j-41e3e246-6716-46bf-820e-fb7b9e17d66d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODc3MDBqLTQxZTNlMjQ2LTY3MTYtNDZiZi04MjBlLWZiN2I5ZTE3ZDY2ZC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.axYat0vO0fOULsCexfyYuA6h6mIeLI6owighvh_aTjY",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d88wvad-5f045d49-989f-4a2e-b95d-170b5cef57fa.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODh3dmFkLTVmMDQ1ZDQ5LTk4OWYtNGEyZS1iOTVkLTE3MGI1Y2VmNTdmYS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.j6Buf_o0glyCxGwjHthg9_kzO7J4SfPXeRK4LZZ0lb4",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d83m6q1-a731bf85-a0ff-47b4-9c3b-6627f067d056.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMmZiMjgyMWEtMTQwNi00YTFkLTliMDQtNjY2OGYyNzhlOTQ0XC9kODNtNnExLWE3MzFiZjg1LWEwZmYtNDdiNC05YzNiLTY2MjdmMDY3ZDA1Ni5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.gY5bF4JEdtoDvygm7YRJ5ZlN2CDCS3ReVAnnc5F7xtM",
];

function BattleGround(props) {
    const [pokemonArray, setPokemonArray] = useState(props.selectedPokemon);
    const bgSelectInt = Math.ceil(Math.random() * bgs.length - 1);
    useEffect(() => {
        pokemonArray.forEach((p, i) => {
            axios
                .get(
                    p.moves[0].move.url
                )
                .then((response) => {
                   // console.log(response.data)
                    let foundIndex = pokemonArray.indexOf(x => x.name === p.name)
                    console.log(foundIndex, pokemonArray[0].name === p.name)
                    if(foundIndex !== -1){
                        console.log("yoooo", pokemonArray[foundIndex])
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        })

    }, [])

    const attack = (mv,) => {
        console.log(attack)
    }

    console.log(pokemonArray)


    return (
        <Container
            maxWidth="lg"
            style={{
                height: "100vh",
                width: "100vw",
                maxWidth: "100vw",
                backgroundImage: "url('" + bgs[bgSelectInt] + "')",
                backgroundPosition: 0,
                backgroundSize: "cover",
                padding: 0,
                margin: 0,
                overflow: "hidden",
            }}
            className={"testing"}
        >
            {pokemonArray.map((p, i) => {
                return (
                    <PokemonContainer
                        me={i}
                        attack={attack}
                        setSelectedPokemon={props.setSelectedPokemon}
                        pokemon={p}
                        setPokemonArray={setPokemonArray}
                    />
                );
            })}
        </Container>
    );
}

function PokemonContainer(props) {
    const [pokemon1, setPokemon1] = useState(props.pokemon)
    let style = {
        position: "absolute",
        padding: "10px",
        top: 10,
        background: "white",
        borderRadius: "5px",
        margin: "auto",
        fontWeight: 800,
        fontSize: "16px",
    };

    const statsContainer = {
        position: "absolute",
        border: "solid 2px black",
        margin: 60,
        padding: 20,
        fontSize: "24px",
        minWidth: "400px",
        minHeight: "100px",
        fontWeight: 700,
        background: "white",
        borderRadius: "5px",
        boxShadow: "inset -12px -8px 40px #464646",
    };

    const buttonGroupStyle = {};

    if (!props.me) {
        style.right = 10;
        statsContainer.bottom = 0;
        statsContainer.right = 0;
        buttonGroupStyle.left = 0;
    } else {
        style.left = 10;
        statsContainer.top = 0;
        statsContainer.left = 0;
        buttonGroupStyle.right = 0;
    }

    return (
        <div>
            <div
                style={{
                    ...statsContainer,
                }}
            >
                <ButtonGroup
                    color="primary"
                    style={{ position: "absolute", ...buttonGroupStyle }}
                    aria-label="outlined primary button group"
                >
                    {props.pokemon.moves.slice(0, 2).map((mv, i) => {
                        console.log(mv)
                        return <Button onClick={() => props.attack(mv)}>{mv.move.name}</Button>;
                    })}
                </ButtonGroup>
                <Button onClick={() => props.setSelectedPokemon([])} style={style}>
                    {props.pokemon.name}
                </Button>s
                <div style={{ position: "absolute", width: "90%", bottom: 0 }}>
                    <LinearProgressWithLabel value={props.pokemon.health} />
                </div>
            </div>
            <Pokemon me={props.me} pokemon={props.pokemon} i={props.me} />
        </div>
    );
}

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress
                    style={{ height: 10 }}
                    variant="determinate"
                    {...props}
                />
            </Box>
            <Box minWidth={60}>
                <Typography variant="body1" color="textSecondary">{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default BattleGround;
