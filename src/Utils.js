import React from "react";
import namor from "namor";
import "./index.css";

let raw;
const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

// const newPerson = () => {
//   const statusChance = Math.random();
//   return {
//     firstName: namor.generate({
//       words: 1,
//       numbers: 0
//     }),
//     lastName: namor.generate({
//       words: 1,
//       numbers: 0
//     }),
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status: statusChance > 0.66 ?
//       "relationship" : statusChance > 0.33 ? "complicated" : "single"
//   };
// };
class Account{
  constructor(name,cards,phone,cards_id){
    this.name=name;
    this.cards=cards;
    this.phone=phone;
    this.cards_id=cards_id;
  }
}

const arrayAccounts = (jsonAccounts) => {
  let arr = [];
  for (let i = 0; i < jsonAccounts.length; i++) {
    arr.push(new Account(jsonAccounts[i].name,jsonAccounts[i].cards,jsonAccounts[i].phone,jsonAccounts[i].cards_id));
  }
  return arr;
}

export function makeData() {
  fetch('http://admin.fasicurrency.com/sbuild/?accounts=1')
    .then(res => res.json())
    .then(data => raw = data)
    .then(() => console.log(raw))
    .then(() => {
      let straw = arrayAccounts(raw);
      return straw;
    });

}

