import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  ButtonGroup,
  Grid,
  Button,
  Divider,
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";

export default function UserList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        xs={12}
        sm={12}
      >
        <div className={classes.demo}>
          <List>
            <UserListItem
              setTimeForBattle={props.setTimeForBattle}
              user={"Bot"}
              userOnline={true}
            />
            <Divider />
            {Object.keys(props.users).map((user, i) => {
              let userOnline = props.users[user].state === "online";
              return (
                <UserListItem
                  key={user}
                  setTimeForBattle={props.setTimeForBattle}
                  userOnline={userOnline}
                  user={user}
                  state={props.users[user].state}
                />
              );
            })}
          </List>
        </div>
      </Grid>
    </div>
  );
}

const UserListItem = (props) => {
  let bot = props.user === "Bot";
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          style={{
            background: props.userOnline && !bot ? green[300] : grey[350],
          }}
        >
          {bot ? "b" : null}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.user}
        secondary={props.state ? props.state : null}
      />
      <ListItemSecondaryAction>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button
            disabled={!props.userOnline}
            variant="outlined"
            color="secondary"
            onClick={() => props.setTimeForBattle()}
          >
            Fight
          </Button>
          {/*<Button color={"secondary"}>X</Button>*/}
        </ButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 2,
    marginBottom: "20px",
    marginLeft: "10px",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 500,
    overflowX: "hidden",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    padding: "10px",
    minWidth: "600px",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));
