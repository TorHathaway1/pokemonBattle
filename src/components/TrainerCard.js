import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  Typography,
  SvgIcon,
  Grid,
  Paper,
} from "@material-ui/core";
import PokemonAvatar from "./PokemonAvatar";
import { renderUserAvatarIcon } from "../common/userFunctions";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
  },
  largeAvatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
}));

export default function TrainerCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader
        style={{ textAlign: "right" }}
        avatar={
          <Avatar
            className={classes.largeAvatar}
            onClick={() => props.setEditAvatar(true)}
            variant={"rounded"}
            style={{ background: "none" }}
          >
            <SvgIcon style={{ fontSize: "7.9rem" }}>
              {renderUserAvatarIcon(props.user)}
            </SvgIcon>
          </Avatar>
        }
        disableTypography
        title={
          <Typography variant="h6" align={"left"}>
            {props.user && props.user.userData.name}
          </Typography>
        }
      />
      <CardActionArea disableRipple>
        <CardContent disableRippleEffect>
          <Paper>
            <Grid container xs={12}>
              {Object.values(props.user.pokemon).map((p, i) => {
                return (
                  <Grid xs={3}>
                    <PokemonAvatar
                      pokemon={p}
                      setShowPokemon={props.setShowPokemon}
                      large
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
          <Paper style={{ marginTop: 10, padding: 5 }}>
            <Grid container xs={12}>
              {[...Array(12)].map((i) => {
                return (
                  <Grid xs={1}>
                    <Avatar
                      variant={"square"}
                      style={{
                        margin: 3,
                        background: "none",
                        border: "2px solid",
                        borderColor: "lightgray",
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
