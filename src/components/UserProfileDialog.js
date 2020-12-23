import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import UserProfileCard from "./UserProfileCard";

export default function UserProfileDialog(props) {
  const handleClose = () => {
    props.setEditAvatar(!props.open);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <UserProfileCard
        setUserProfile={props.setUserProfile}
        user={props.user}
      />
    </Dialog>
  );
}
