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
       //return Promise.reject(new Error("Не верный пользовательский ввод"));        
        }
        if (response.status === 500){
            throw new Error("Ошибка сервера");                      
        }
        /*else {
        alert("Что-то пошло не так");
        return Promise.reject(new Error("Ошибка сервера"));
        }*/
      });
}