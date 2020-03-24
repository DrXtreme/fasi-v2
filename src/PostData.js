export function PostData(type, userData) {
<<<<<<< HEAD
    let BaseURL = 'https://atest.fasicurrency.com/api/';
=======
    let BaseURL = 'http://localhost:8080/api/';
>>>>>>> tmp
    console.log(BaseURL+type);
    return new Promise((resolve, reject) =>{
    fetch(BaseURL+type, {
   method: 'POST',
   body: JSON.stringify(userData)
   })
   .then((response) => response.json())
   .then((res) => {
    resolve(res);
   })
   .catch((error) => {
    reject(error);
   });
   });
   }