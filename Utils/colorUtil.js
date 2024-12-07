exports.assignNumber = (usersIDs , users) => {
  let userNumber;

  if (usersIDs.length === 0) {
    userNumber = "one";
  } else if (usersIDs.length === 1) {
    userNumber = users[usersIDs[0]]?.playerNumber === "one" ? "two" : "one";
  }

  return userNumber;
};
