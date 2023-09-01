export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/ekaterinabbkv/comments", {
    method: "GET"
  })  
  .then((response) => {      
    return response.json();
  });  
}  

export function postComment(name, comment) {
    return fetch("https://wedev-api.sky.pro/api/v1/ekaterinabbkv/comments", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          text: comment,
          forceError: true,
        }),        
      })
      .then((response) => {        
        if (response.status === 201) {
          return response.json();
        }  
        else if (response.status === 400){
        alert("Мало символов");
        if (nameInputElement.value.length < 3) {
          nameInputElement.classList.add("color");
        }
        if (commentInputElement.value.length < 3) {
          commentInputElement.classList.add("color");
        }
        return Promise.reject(new Error("Не верный пользовательский ввод"));        
        }
        else {
        return Promise.reject(new Error("Ошибка сервера"));
        }
      });
}