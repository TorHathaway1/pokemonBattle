import SvgIcon from "@material-ui/core/SvgIcon";
import femaleTrainer from "../images/female-trainer.svg";
import MaleTrainer from "../images/MaleTrainer";
import FemaleTrainer from "../images/FemaleTrainer";
import React from "react";

export const renderUserAvatarIcon = (user, size) => {
  if (user && user.userData.avatarSettings) {
    if (user.userData.avatarSettings.gender === "female") {
      return (
        <SvgIcon style={{ fontSize: size === "large" ? "4rem" : "3rem" }}>
          <FemaleTrainer
            hatColor1={
              user.userData.avatarSettings.hatColor1
                ? user.userData.avatarSettings.hatColor1
                : null
            }
            hatColor2={
              user.userData.avatarSettings.hatColor2
                ? user.userData.avatarSettings.hatColor2
                : null
            }
            skinColor1={
              user.userData.avatarSettings.skinColor1
                ? user.userData.avatarSettings.skinColor1
                : null
            }
            skinColor2={
              user.userData.avatarSettings.skinColor2
                ? user.userData.avatarSettings.skinColor2
                : null
            }
            shirtColor1={
              user.userData.avatarSettings.shirtColor1
                ? user.userData.avatarSettings.shirtColor1
                : null
            }
            shirtColor2={
              user.userData.avatarSettings.shirtColor2
                ? user.userData.avatarSettings.shirtColor2
                : null
            }
            underShirtColor={
              user.userData.avatarSettings.underShirtColor
                ? user.userData.avatarSettings.underShirtColor
                : null
            }
          />
        </SvgIcon>
      );
    } else if (user.userData.avatarSettings.gender === "male") {
      return (
        <MaleTrainer
          hatColor1={
            user.userData.avatarSettings.hatColor1
              ? user.userData.avatarSettings.hatColor1
              : null
          }
          hatColor2={
            user.userData.avatarSettings.hatColor2
              ? user.userData.avatarSettings.hatColor2
              : null
          }
          skinColor1={
            user.userData.avatarSettings.skinColor1
              ? user.userData.avatarSettings.skinColor1
              : null
          }
          skinColor2={
            user.userData.avatarSettings.skinColor2
              ? user.userData.avatarSettings.skinColor2
              : null
          }
          shirtColor1={
            user.userData.avatarSettings.shirtColor1
              ? user.userData.avatarSettings.shirtColor1
              : null
          }
          shirtColor2={
            user.userData.avatarSettings.shirtColor2
              ? user.userData.avatarSettings.shirtColor2
              : null
          }
        />
      );
    }
  }
  return null;
};
