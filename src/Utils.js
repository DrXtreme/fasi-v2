import React from "react";
import "./index.css";

let raw;
const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};


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
  fetch(''+process.env.REACT_APP_SERVER_URL+'/?accounts=1')
    .then(res => res.json())
    .then(data => raw = data)
    .then(() => console.log(raw))
    .then(() => {
      let straw = arrayAccounts(raw);
      return straw;
    });

}

