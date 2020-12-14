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
import AdbIcon from "@material-ui/icons/Adb";
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
        item={true}
      >
        <div className={classes.demo}>
          <List>
            <UserListItem
              setTimeForBattle={props.setTimeForBattle}
              user={{ userData: { name: "Bot" } }}
              userOnline={true}
              challengeBot={props.challengeBot}
            />
            <Divider />
            {Object.keys(props.statusOfUsers).map((user, i) => {
              let userOnline = props.statusOfUsers[user].state === "online";
              if (user !== props.user.uid) {
                return (
                  <UserListItem
                    key={user}
                    setTimeForBattle={props.setTimeForBattle}
                    userOnline={userOnline}
                    user={props.users[user]}
                    state={props.statusOfUsers[user].state}
                    challengeUser={props.challengeUser}
                  />
                );
              } else {
                return null;
              }
            })}
          </List>
        </div>
      </Grid>
    </div>
  );
}

const UserListItem = (props) => {
  let bot = props.user.userData.name === "Bot";
  let currentlyFighting = !bot && props.user.userData.status !== "";
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          style={{
            background: props.userOnline && !bot ? green[300] : grey[350],
          }}
        >
          {bot ? <AdbIcon /> : null}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.user.userData.name}
        secondary={props.state ? props.state : null}
      />
      <ListItemSecondaryAction>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button
            disabled={!props.userOnline || (currentlyFighting && !bot)}
            variant="outlined"
            color="secondary"
            onClick={
              bot
                ? () => props.challengeBot()
                : () => props.challengeUser(props.user)
            }
          >
            {currentlyFighting ? props.user.userData.status : "Fight"}
          </Button>
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
