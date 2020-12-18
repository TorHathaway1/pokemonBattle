import { createMuiTheme } from "@material-ui/core/styles";
import {
  brown,
  blue,
  pink,
  purple,
  green,
  red,
  orange,
  blueGrey,
  yellow,
  grey,
  lightBlue,
  deepPurple,
  lime,
} from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    ground: brown[200],
    water: lightBlue[200],
    dragon: red[200],
    fairy: pink[200],
    fighting: orange[300],
    electric: yellow[300],
    fire: red[200],
    rock: grey[400],
    ice: blue[200],
    dark: grey[300],
    psychic: deepPurple[200],
    flying: lightBlue[500],
    grass: green[200],
    bug: lime[200],
    ghost: blueGrey[200],
    poison: purple[300],
    normal: blueGrey[300],
  },
  overrides: {
    MuiCard: {
      disableRipple: true,
    },
    MuiAvatar: {
      rounded: {
        borderRadius: "20px",
      },
    },
  },
});

export default theme;
