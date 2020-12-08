import firebase from "../firebaseConfig";

export const setUserOnlineStatus = () => {
  var uid = firebase.auth().currentUser.uid;
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  var isOfflineForDatabase = {
    state: "offline",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
  firebase
    .database()
    .ref(".info/connected")
    .on("value", function (snapshot) {
      if (snapshot.val() === false) {
        return;
      }
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(function () {
          userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });
};
