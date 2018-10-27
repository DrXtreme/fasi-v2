import "./index.css";
import 'whatwg-fetch';

let raw = [];


const newAccount = (jsonObj) => {
    return {
        id: jsonObj.id,
        name: jsonObj.name,
        cards: jsonObj.cards,
        phone: jsonObj.phone,
        cards_id: jsonObj.cards_id
    };
};

const arrayAccounts = (jsonAccounts) => {
    let arr = [];
    for(let i=0;i<jsonAccounts.length;i++){
        arr.push(newAccount(jsonAccounts[i]));
    }
    return arr;
}


export function makeData() {
    return fetch('http://admin.fasicurrency.com/sbuild/?accounts=1')
    .then(res => res.json())
    .then(data => raw = data)
    .then(() => {
      raw = arrayAccounts(raw);
      return raw;
    });
}