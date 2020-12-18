import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 500,
    width: "100%",
    minWidth: 500,
  },
}));

export default function PokemonCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const pokemonImg =
    props.pokemon.sprites.other["official-artwork"].front_default;
  return (
    <Card
      className={classes.card}
      style={{
        background: props.pokemon.selected !== true ? "inherit" : "red",
      }}
      onClick={
        props.userIsSelectingPokemon
          ? () => props.selectPokemon(props.pokemon)
          : null
      }
    >
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.pokemon.sprites.other["official-artwork"].front_default}
          title={props.pokemon.name}
        >
          {!pokemonImg && <Skeleton animation="wave" />}
        </CardMedia>

        <CardContent>
          <Typography gutterBottom variant="h4" align={"center"} component="h2">
            {props.pokemon.name}
          </Typography>
          {props.pokemon.types.map((t, i) => {
            return (
              <Button
                key={i}
                variant="outlined"
                style={{
                  margin: 2,
                  background: theme.palette[t.type ? t.type.name : "ground"],
                }}
              >
                {t.type.name}
              </Button>
            );
          })}
          <div>{props.children}</div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
