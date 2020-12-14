import React from "react";
import {
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  Dialog,
} from "@material-ui/core";

export default function PreBattleDialog(props) {
  const [open, setOpen] = React.useState(props.open);

  const handleAcceptChallenge = (value) => {
    setOpen(false);
    props.acceptChallenge();
  };

  const handleDenyChallenge = (value) => {
    setOpen(false);
    props.denyChallenge();
  };

  return (
    <Dialog
      onClose={handleDenyChallenge}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleDenyChallenge}>
        {props.challenger ? "Waiting on acceptance" : "You've been challenged!"}
      </DialogTitle>
      <DialogContent dividers>
        {props.challenger
          ? "Waiting on acceptance from"
          : "Would you like to battle"}{" "}
        <b>
          {props.user &&
            props.user.userData.opponent &&
            props.users[props.user.userData.opponent].userData.name}
        </b>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleAcceptChallenge}
          color="default"
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDenyChallenge}
        >
          Deny
        </Button>
      </DialogActions>
    </Dialog>
  );
}
