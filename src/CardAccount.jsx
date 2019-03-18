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
        avail: jsonObj.avail,
        card_code: jsonObj.card_code,
        card_number: jsonObj.card_number,
        fee_type: jsonObj.fee_type
    };
};

const arrayCardAccounts = (jsonAccounts) => {
    let arr = [];
    for(let i=0;i<jsonAccounts.length;i++){
        arr.push(newCardAccount(jsonAccounts[i]));
    }
    return arr;
}
const url = 'https://sofian.tru.io/sbuild/';

export function makeCardData() {
    return fetch(url+'?cardAccounts=1')
    .then(res => res.json())
    .then(data => raw = data)
    .then(() => {
      raw = arrayCardAccounts(raw);
      return raw;
    });
}