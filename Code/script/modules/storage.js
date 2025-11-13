export const KEY = "ycd_bank";

function createEmptyStore() {
  return { 
    users: [], 
    activeUserEmail: null 
  };
}

function readStore() {
  const dataString = localStorage.getItem(KEY);

  if (!dataString) {
    console.log("No data found, create new store");
    return createEmptyStore();
  }

  try {
    const data = JSON.parse(dataString);

    if (data && data.users) {
      // console.log("Data loaded");
      return data;
    } else {
      console.log("Bad data, create new store");
      return createEmptyStore();
    }
  } catch (error) {
    console.log("Problem reading data");
    return createEmptyStore();
  }
}

function writeStore(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// --- Exported Functions ---

export function findUserByEmail(email) {
  if (!email) {
    return null;
  }
  const store = readStore();
  const foundUser = store.users.find(
    (userObject) => userObject.user.email === email
  );
  return foundUser || null;
}

export function load() {
  const store = readStore();
  const email = store.activeUserEmail;

  if (!email) {
    return null; 
  }

  const activeUser = store.users.find(
    (userObject) => userObject.user.email === email
  );

  return activeUser || null;
}

export function save(userToSave) {
  const email = userToSave.user.email;

  if (!email) {
    console.log("Problem: Cannot save user no email");
    return;
  }

  const store = readStore();

  const index = store.users.findIndex(
    (userObject) => userObject.user.email === email
  );

  if (index === -1) {
    store.users.push(userToSave);
    console.log("New user saved");
  } else {
    store.users[index] = userToSave;
    console.log("User data updated");
  }

  store.activeUserEmail = email;

  writeStore(store);
}