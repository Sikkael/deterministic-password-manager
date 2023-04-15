import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import sha256 from 'crypto-js/sha256';

export async function getPasswords(query) {
  await fakeNetwork(`getPasswords:${query}`);
  let passwords = await localforage.getItem("passwords");
  if (!passwords) passwords = [];
  if (query) {
    passwords = matchSorter(passwords, query, { keys: ["service"] });
  }
  
  return passwords.sort(sortBy("service", "createdAt"));
}

export async function createPassword() {
  await fakeNetwork();
  
  let id = Math.random().toString(36).substring(2, 9);
  let password = { id, createdAt: Date.now() };
  console.log(password)
  let passwords = await getPasswords();
  passwords.unshift(password);
  await set(passwords);
  return password;
}

export async function getPassword(id) {
  await fakeNetwork(`password:${id}`);
  let passwords = await localforage.getItem("passwords");
  let password = passwords.find(password => password.id === id);
  return password ?? null;
}

export async function updatePassword(id, updates) {
  await fakeNetwork();
  let passwords = await localforage.getItem("passwords");
  let password = passwords.find(password => password.id === id);
  if (!password) throw new Error("No password found for", id);
  Object.assign(password, updates);
  await set(passwords);
  return password;
}

export async function deletePassword(id) {
  let passwords = await localforage.getItem("passwords");
  let index = passwords.findIndex(password => password.id === id);
  if (index > -1) {
    passwords.splice(index, 1);
    await set(passwords);
    return true;
  }
  return false;
}

export async function generatePassword(id) {
  let passwords = await localforage.getItem("passwords");
  let index = passwords.findIndex(password => password.id === id);
  const alph  = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:;<=>?~!@#$%^&*+-/.,{}[]()abcdefghijklmnopqrstuvwxyz"
  
  if (index > -1) {
    let s = ""; 
    let hash = sha256( passwords[index].service+":"+passwords[index].username+":"
    +passwords[index].passphrase+":"+passwords[index].counter).toString();
    
    for(let i =0;i<hash.length;i+=2)
    {
      console.log(alph[parseInt(hash[i]+hash[i+1], 16)%alph.length])
      s = s+ alph[parseInt(hash[i]+hash[i+1], 16)%alph.length]
    }
   
    navigator.clipboard.writeText(s);
    alert(s);
    
    return true;
  }
  return false;
}

function set(passwords) {
  return localforage.setItem("passwords", passwords);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}