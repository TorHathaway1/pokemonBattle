import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { ColorPalette } from "material-ui-color";
import tinycolor from "tinycolor2";

import MaleTrainer from "../images/MaleTrainer";
import FemaleTrainer from "../images/FemaleTrainer";

const hatPalette = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  yellow: "yellow",
  cyan: "cyan",
  lime: "lime",
  gray: "gray",
  orange: "orange",
  liteBlue: "lightBlue",
  black: "black",
  white: "white",
  pink: "pink",
};

const skinPalette = {
  navajoWhite: "#FFDBAC",
  plain: "#F9C19B",
  mellowApricot: "#F1C27D",
  fawn: "#E0AC69",
  peru: "#C68642",
  russet: "#8D5524",
};

const shirtPalette = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  yellow: "yellow",
  cyan: "cyan",
  lime: "lime",
  gray: "gray",
  orange: "orange",
  liteBlue: "lightBlue",
  black: "black",
  white: "white",
  pink: "pink",
};

const useStyles = makeStyles({
  root: {
    width: 500,
    margin: "auto",
    textAlign: "center",
  },
  palette: {
    justifyContent: "center",
    display: "flex",
  },
});

export default function UserProfileCard(props) {
  const classes = useStyles();
  const [gender, setGender] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.gender
      : "male"
  );
  const [hatColor1, setHatColor1] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.hatColor1
      : ""
  );
  const [hatColor2, setHatColor2] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.hatColor2
      : ""
  );

  const [skinColor1, setSkinColor1] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.skinColor1
      : ""
  );
  const [skinColor2, setSkinColor2] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.skinColor2
      : ""
  );

  const [shirtColor1, setShirtColor1] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.shirtColor1
      : ""
  );
  const [shirtColor2, setShirtColor2] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.shirtColor2
      : ""
  );
  const [underShirtColor, setUnderShirtColor] = useState(
    props.user && props.user.userData && props.user.userData.avatarSettings
      ? props.user.userData.avatarSettings.underShirtColor
      : ""
  );

  const saveUserProfile = () => {
    let newAvatarSettings = {
      gender: gender,
      hatColor1: hatColor1,
      hatColor2: hatColor2,
      skinColor1: skinColor1,
      skinColor2: skinColor2,
      shirtColor1: shirtColor1,
      shirtColor2: shirtColor2,
      underShirtColor: underShirtColor,
    };
    props.setUserProfile(newAvatarSettings);
  };

  const selectHatColor = (color) => {
    setHatColor1(hatPalette[color]);
    setHatColor2(tinycolor(hatPalette[color]).darken(10).toString());
  };

  const selectSkinColor = (color) => {
    setSkinColor1(skinPalette[color]);
    setSkinColor2(tinycolor(skinPalette[color]).darken(10).toString());
  };

  const selectShirtColor = (color) => {
    setShirtColor1(shirtPalette[color]);
    setShirtColor2(tinycolor(shirtPalette[color]).darken(10).toString());

    var colors = tinycolor(shirtPalette[color]).tetrad();
    var analogousColorArray = colors.map(function (t) {
      return t.toHexString();
    });
    setUnderShirtColor(
      analogousColorArray[
        Math.floor(Math.random() * analogousColorArray.length)
      ].toString()
    );
  };

  return (
    <Card className={classes.root}>
      <CardActionArea disableRipple={true}>
        {gender === "male" ? (
          <MaleTrainer
            hatColor1={hatColor1}
            hatColor2={hatColor2}
            skinColor1={skinColor1}
            skinColor2={skinColor2}
            shirtColor1={shirtColor1}
            shirtColor2={shirtColor2}
            underShirtColor={underShirtColor}
          />
        ) : (
          <FemaleTrainer
            hatColor1={hatColor1}
            hatColor2={hatColor2}
            skinColor1={skinColor1}
            skinColor2={skinColor2}
            shirtColor1={shirtColor1}
            shirtColor2={shirtColor2}
            underShirtColor={underShirtColor}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.user.userData.name}
          </Typography>
          <ToggleButtons gender={gender} setGender={setGender} />
          <div className={classes.palette}>
            <ColorPalette
              palette={hatPalette}
              onSelect={selectHatColor}
              className={classes.palette}
            />
          </div>
          <div className={classes.palette}>
            <ColorPalette
              palette={skinPalette}
              onSelect={selectSkinColor}
              className={classes.palette}
            />
          </div>
          <div className={classes.palette}>
            <ColorPalette
              palette={shirtPalette}
              onSelect={selectShirtColor}
              className={classes.palette}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={saveUserProfile}>
            Save
          </Button>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

const ToggleButtons = (props) => {
  const [gender, setGender] = React.useState(props.gender);

  const handleGender = (event, newGender) => {
    if (newGender !== null) {
      setGender(newGender);
      props.setGender(newGender);
    }
  };

  return (
    <ToggleButtonGroup
      value={gender}
      exclusive
      onChange={handleGender}
      aria-label="text alignment"
    >
      <ToggleButton value="male" aria-label="male">
        Male
      </ToggleButton>
      <ToggleButton value="female" aria-label="female">
        Female
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
