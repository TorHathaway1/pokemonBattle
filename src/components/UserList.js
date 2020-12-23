import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
  SvgIcon,
  Badge,
} from "@material-ui/core";
import AdbIcon from "@material-ui/icons/Adb";
import { green, grey } from "@material-ui/core/colors";
import { renderUserAvatarIcon } from "../common/userFunctions";

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
            {Object.keys(props.statusOfUsers)
              .sort((a, b) =>
                props.statusOfUsers[a].state < props.statusOfUsers[b].state
                  ? 1
                  : -1
              )
              .map((user, i) => {
                let userOnline = props.statusOfUsers[user].state === "online";
                if (user !== props.user.uid && props.users[user]) {
                  return (
                    <UserListItem
                      key={user}
                      setTimeForBattle={props.setTimeForBattle}
                      userOnline={userOnline}
                      user={props.users[user]}
                      state={props.statusOfUsers[user].state}
                      challengeUser={props.challengeUser}
                      setShowTrainer={props.setShowTrainer}
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
        <UserListItemAvatar
          userOnline={props.userOnline}
          bot={bot}
          setShowTrainer={props.setShowTrainer}
          user={props.user}
        />
      </ListItemAvatar>
      <ListItemText
        primary={props.user.userData.name}
        // secondary={props.state ? props.state : null}
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

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: (props) =>
      props.userOnline ? "#44b700" : theme.palette.background.paper,
    color: (props) => (props.userOnline ? "#44b700" : "grey"),
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    marginRight: 10,
    border: (props) => `1px solid ${props.userOnline ? " #44b700" : "grey"}`,
    "&::after": (props) => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    }),
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const UserListItemAvatar = (props) => {
  const classes = useStyles();
  return (
    <StyledBadge
      overlap="circle"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      variant="standard"
      userOnline={props.userOnline}
      badgeContent=""
    >
      <Avatar
        style={{
          background:
            props.userOnline || props.bot
              ? props.bot
                ? green[200]
                : green[100]
              : grey[350],
        }}
        variant={props.bot ? "rounded" : "circular"}
        className={classes.large}
        onClick={!props.bot ? () => props.setShowTrainer(props.user) : null}
      >
        {props.bot ? (
          <AdbIcon style={{ fontSize: "2.25rem" }} />
        ) : (
          <SvgIcon style={{ fontSize: "4rem" }}>
            {renderUserAvatarIcon(props.user, "large")}
          </SvgIcon>
        )}
      </Avatar>
    </StyledBadge>
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
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));
