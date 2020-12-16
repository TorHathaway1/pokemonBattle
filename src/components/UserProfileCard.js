import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import femaleTrainer from "../images/female-trainer.svg";
import maleTrainer from "../images/male-trainer.svg";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: "auto",
  },
});

export default function UserProfileCard(props) {
  const classes = useStyles();
  const [gender, setGender] = useState("male");

  const saveUserProfile = () => {
    let newAvatarSettings = {
      gender: gender,
    };
    props.setUserProfile(newAvatarSettings);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="pokemon trainer"
          image={gender === "male" ? maleTrainer : femaleTrainer}
          title="Pokemon Trainer"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Trainers Name Here
          </Typography>
          <ToggleButtons gender={gender} setGender={setGender} />
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
