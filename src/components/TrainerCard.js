import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import { renderUserAvatarIcon } from "../common/userFunctions";
import tinycolor from "tinycolor2";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
  },
  largeAvatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  pokemonAvatar: {
    margin: theme.spacing(1),
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
}));

export default function TrainerCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Card className={classes.card}>
      <CardHeader
        style={{ textAlign: "right" }}
        avatar={
          <Avatar
            className={classes.largeAvatar}
            onClick={() => props.setEditAvatar(true)}
            variant={"rounded"}
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
      <CardActionArea>
        <CardContent disableRippleEffect>
          <Paper>
            <Grid container xs={12}>
              {Object.values(props.user.pokemon).map((p, i) => {
                return (
                  <Grid xs={3}>
                    <Avatar
                      variant={"rounded"}
                      onClick={() => props.setShowPokemon(p)}
                      style={{
                        border: "solid 3px",
                        borderColor: tinycolor(
                          theme.palette[
                            p.types[0].type ? p.types[0].type.name : "ground"
                          ]
                        )
                          .darken(10)
                          .toString(),
                        background: tinycolor(
                          theme.palette[
                            p.types[0].type ? p.types[0].type.name : "ground"
                          ]
                        )
                          .lighten(20)
                          .toString(),
                      }}
                      key={p.name}
                      alt={p.name}
                      className={classes.pokemonAvatar}
                      src={
                        Object.values(props.user.pokemon)[i].sprites.other[
                          "official-artwork"
                        ].front_default
                      }
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
