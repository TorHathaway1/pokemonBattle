import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import {Button, Card, CardActionArea, CardContent, CardMedia, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 300,
    },
}));

export default function PokemonCard(props) {
    const classes = useStyles();
    const theme = useTheme();
    console.log(props.pokemon)
    return (
        <Card
            className={classes.card}
            style={{
                background: props.pokemon.selected !== true ? "inherit" : "red",
            }}
            onClick={() => props.selectPokemon(props.pokemon)}
        >
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.pokemon.sprites.other["official-artwork"].front_default}
                    title={props.pokemon.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h4" align={"center"} component="h2">
                        {props.pokemon.name}
                    </Typography>
                    {props.pokemon.types.map((t, i) => {
                        return(
                            <Button key={i} variant="outlined"
                                    style={{margin: 2, background: theme.palette[t.type.name]}}>
                                {t.type.name}
                            </Button>
                        )
                    })}
                    {props.children}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
