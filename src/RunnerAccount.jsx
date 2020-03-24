import "./index.css";
import 'whatwg-fetch';

let raw = [];


const newRunner = (jsonObj) => {
    return {
        id: jsonObj.id,
        name: jsonObj.name,
        fee: jsonObj.fee,
        cards_rec: jsonObj.cards_rec,
        cards_sent: jsonObj.cards_sent,
        drawn: jsonObj.drawn,
        diposited: jsonObj.diposited,
        phone: jsonObj.phone,
        country: jsonObj.country,
        created: jsonObj.created
    };
};

const arrayRunners = (jsonAccounts) => {
    let arr = [];
    for(let i=0;i<jsonAccounts.length;i++){
        arr.push(newRunner(jsonAccounts[i]));
    }
    return arr;
}


export function makeRunnerData() {
    var form = new FormData();
    form.set('runners',1);
<<<<<<< HEAD
    return fetch('https://atest.fasicurrency.com/api/',{
=======
    return fetch('http://localhost:8080/api/',{
>>>>>>> tmp
        method: 'POST',
        body: form
    })
    .then(res => res.json())
    .then(data => raw = data)
    .then(() => {
      raw = arrayRunners(raw);
      return raw;
    });
}