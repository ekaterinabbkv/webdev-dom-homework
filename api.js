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
        else if (response.status === 400){
        alert("Мало символов");
       /* if (name.length < 3) {
          name.classList.add("color");
        }
        if (text.length < 3) {
          text.classList.add("color");
        }*/
        return Promise.reject(new Error("Не верный пользовательский ввод"));        
        }
        else {
        alert("Что-то пошло не так");
        return Promise.reject(new Error("Ошибка сервера"));
        }
      });
}