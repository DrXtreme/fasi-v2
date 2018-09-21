import "./index.css";
import 'whatwg-fetch';

let raw = [];


const newCardAccount = (jsonObj) => {
    return {
        id: jsonObj.id,
        owname: jsonObj.owname,
        type: jsonObj.type,
        exp: jsonObj.exp,
        state: jsonObj.state,
        bank: jsonObj.bank,
        credit: jsonObj.credit,
        drawn: jsonObj.drawn,
        avail: jsonObj.avail
    };
};

const arrayCardAccounts = (jsonAccounts) => {
    let arr = [];
    for(let i=0;i<jsonAccounts.length;i++){
        arr.push(newCardAccount(jsonAccounts[i]));
    }
    return arr;
}


export function makeCardData() {
    return fetch('http://localhost/?cardAccounts=1')
    .then(res => res.json())
    .then(data => raw = data)
    .then(() => {
      raw = arrayCardAccounts(raw);
      return raw;
    });
}