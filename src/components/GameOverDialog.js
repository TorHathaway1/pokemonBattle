import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default function GameOverDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.showGameOverDialog);

  const handleClose = (value) => {
    setOpen(false);
    props.isGameOver(false);
  };

  const handleListItemClick = (value) => {
    handleClose(value);
  };

  console.log(props.winner);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={props.showGameOverDialog}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {props.winner && props.winner.name} Won!
      </DialogTitle>
      <DialogContent dividers>
        <img
          src={
            props.winner &&
            props.winner.sprites.other["official-artwork"].front_default
          }
        />
        <Typography gutterBottom>
          {props.expGainForWinner} exp gained.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Thanks!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
