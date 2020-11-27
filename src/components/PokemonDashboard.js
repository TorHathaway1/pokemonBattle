import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Avatar,
    Chip,
} from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import PokemonCard from "../components/PokemonCard";

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

export default function PokemonDashBoard(props) {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <Grid container spacing={3}>
                {Object.values(props.usersPokemon).map((p, i) => {
                    <PokemonCardData pokemon={p} setPokemon={props.setPokemon} />
                })}
            </Grid>
        </div>
    )
}

function PokemonCardData(props)  {
    const classes = useStyles();
    return (
        <Grid item xs={4}>
            <PokemonCard
                selectPokemon={props.selectPokemon}
                pokemon={props.pokemon}
            >
                <Typography variant="subtitle1" className={classes.title}>
                    {props.pokemon.height} m
                </Typography>
                <Typography variant="subtitle2" className={classes.title}>
                    {props.pokemon.weight} lbs
                </Typography>
                <Grid container>
                    {props.pokemon.stats.map((s,i) => {
                        return (
                            <Grid xs={4}>
                                <Chip avatar={<Avatar>{s.stat.name}</Avatar>} label={s.base_stat} />
                            </Grid>
                        )
                    })}
                </Grid>
            </PokemonCard>
        </Grid>
    );
}

