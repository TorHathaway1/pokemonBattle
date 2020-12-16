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
    water: blue[200],
    dragon: red[200],
    fairy: pink[200],
    fighting: orange[500],
    electric: yellow[300],
    fire: red[400],
    rock: grey[400],
    ice: blue[100],
    dark: grey[600],
    psychic: purple[200],
    flying: blue[500],
    grass: green[300],
    bug: yellow[200],
    ghost: blueGrey[300],
    poison: purple[300],
  },
  overrides: {
    // Style sheet name ⚛️
    MuiCard: {
      // Name of the rule
      disableRipple: true,
    },
  },
});

export default theme;
