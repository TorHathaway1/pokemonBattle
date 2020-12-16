import femaleTrainer from "../images/female-trainer.svg";
import maleTrainer from "../images/male-trainer.svg";

export const renderUserAvatar = (user) => {
  if (user && user.userData.avatarSettings) {
    if (user.userData.avatarSettings.gender === "female") {
      return femaleTrainer;
    } else if (user.userData.avatarSettings.gender === "male") {
      return maleTrainer;
    }
    return user.userData.photoURL;
  }
  return null;
};
