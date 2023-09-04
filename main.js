import { getComments } from "./api.js";
import { postComment } from "./api.js";
import { renderComments } from "./renderComments.js"

let commentsArr = [];

const buttonElement = document.getElementById("add-button");
const loadingForm = document.getElementById("loadingForm");
const loading = document.getElementById("loading");
const form = document.getElementById("add-form");
const delFormBtn = document.querySelector(".del-form-button");
const nameInputElement = document.getElementById("name-input");
const commentInputElement = document.getElementById("comment-input");

loading.textContent = "Комментарии загружаются...";
const fetchGet = () => {
  getComments().then((responseData) => {
    const appComments = responseData.comments.map((comment) => {
      return {
        name: comment.author.name,
        date: now(new Date(comment.date)),
        text: comment.text,
        likes: 0,
        myLike: false,
      };
    });
    commentsArr = appComments;
    loading.textContent = "";
    renderComments({ commentsArr });
  });
};
fetchGet();

buttonElement.disabled = true;

document.addEventListener("input", () => {
  nameInputElement.value != "" && commentInputElement.value != ""
    ? (buttonElement.disabled = false)
    : (buttonElement.disabled = true);
});

document.addEventListener("keyup", (e) => {
  if (
    (e.code === "Enter" || e.code === "NumpadEnter") &&
    !buttonElement.disabled
  ) {
    createNewComment();
    renderComments({ commentsArr });
  }
});

delFormBtn.addEventListener("click", () => {
  commentsArr.pop();
  renderComments({ commentsArr });
  if (!commentsArr) delFormBtn.disabled = true;
});


//renderComments({ commentsArr });

const plusZero = (str) => {
  return str < 10 ? `0${str}` : str;
};

const now = (currentDate) => {
  let minute = plusZero(currentDate.getMinutes());
  let hours = plusZero(currentDate.getHours());
  let date = plusZero(currentDate.getDate());
  let month = plusZero(currentDate.getMonth() + 1);
  return `${date}.${month}.${
    currentDate.getFullYear() % 100
  } ${hours}:${minute}`;
};

const createNewComment = () => {
  form.classList.add("none");
  loadingForm.textContent = "Комментарий добавляется...";
  // подписываемся на успешное завершение запроса с помощью then
  const post = (text) => {
    postComment({
      name: nameInputElement.value,
      text: commentInputElement.value,
    })
      .then(() => {
        fetchGet();
      })
      .then(() => {
        loadingForm.textContent = "";
        form.classList.remove("none");
        commentInputElement.value = "";
        nameInputElement.value = "";
      })
      .catch((error) => {
        console.warn(error);
        if (error.message === "Неверный запрос") {
          alert("Мало символов");
        }
        if (error.message === "Ошибка сервера") {
          alert("Сервер сломался, попробуйте позже");
          post(text);
        }
        if (window.navigator.onLine === false) {
          alert("Проблемы с интернетом, проверьте подключение");
        }
        loadingForm.textContent = "";
        form.classList.remove("none");
      });
  };
  post();
  renderComments({ commentsArr });
};

buttonElement.addEventListener("click", () => {
  createNewComment();
  renderComments({ commentsArr });
});

console.log("It works!");
