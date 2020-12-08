import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import TagFacesIcon from "@material-ui/icons/TagFaces";

export default function Stats(props) {
  const classes = useStyles();
  return (
    <Paper component="ul" className={classes.root}>
      {props.stats.map((stat, i) => {
        let icon;
        if (stat.label === "React") {
          icon = <TagFacesIcon />;
        }

        let avatarContents = stat.stat.name[0] + stat.stat.name[1];
        let hypenated = stat.stat.name.split("-").length === 2;
        if (hypenated) {
          let first = stat.stat.name.split("-")[0];
          let second = stat.stat.name.split("-")[1];
          avatarContents = first[0] + "/" + second[0];
        }

        return (
          <li key={i}>
            <Chip
              color="primary"
              avatar={<Avatar>{avatarContents}</Avatar>}
              icon={icon}
              label={stat.base_stat}
              className={classes.chip}
            />
          </li>
        );
      })}
    </Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));
