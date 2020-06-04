export function PostData(type, userData) {
    let BaseURL = ''+process.env.REACT_APP_SERVER_URL+'/';
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