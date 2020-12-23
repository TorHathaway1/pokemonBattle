import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { Avatar } from "@material-ui/core";
import tinycolor from "tinycolor2";
import React from "react";

const useStyles = makeStyles((theme) => ({
  pokemonAvatarSm: {
    margin: theme.spacing(0.5),
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  pokemonAvatarMd: {
    margin: theme.spacing(1),
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  pokemonAvatarLg: {
    margin: theme.spacing(1),
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  displayInline: {
    display: "inline-block",
  },
}));

const PokemonAvatar = (props) => {
  const { pokemon, small, medium, large } = props;
  const {
    pokemonAvatarSm,
    pokemonAvatarMd,
    pokemonAvatarLg,
    displayInline,
  } = useStyles();
  const theme = useTheme();
  return (
    <Avatar
      {...props}
      variant={"rounded"}
      onClick={() => props.setShowPokemon(pokemon)}
      style={{
        border: "solid 3px",
        borderColor: tinycolor(
          theme.palette[
            pokemon.types[0].type ? pokemon.types[0].type.name : "ground"
          ]
        )
          .darken(10)
          .toString(),
        background: tinycolor(
          theme.palette[
            pokemon.types[0].type ? pokemon.types[0].type.name : "ground"
          ]
        )
          .lighten(20)
          .toString(),
      }}
      key={pokemon.name}
      alt={pokemon.name}
      className={clsx(
        props.displayInline ? displayInline : null,
        small ? pokemonAvatarSm : medium ? pokemonAvatarMd : pokemonAvatarLg
      )}
      src={pokemon.sprites.other["official-artwork"].front_default}
    />
  );
};

export default PokemonAvatar;
