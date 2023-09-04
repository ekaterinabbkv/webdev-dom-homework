export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/ekaterinabbkv/comments", {
    method: "GET"
  })  
  .then((response) => {      
    return response.json();
  });  
}  

export function postComment({ name, text }) {
    return fetch("https://wedev-api.sky.pro/api/v1/ekaterinabbkv/comments", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          text: text,
          forceError: true,
        }),        
      })
      .then((response) => {        
        if (response.status === 201) {
            return response.json();
        }  
        if (response.status === 400){
            throw new Error("Мало символов");        
        }
        if (response.status === 500){
            throw new Error("Ошибка сервера");                      
        }        
      });
}