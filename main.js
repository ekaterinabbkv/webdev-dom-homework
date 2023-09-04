import { getComments } from "./api.js";
import { postComment } from "./api.js";

let commentsArr = [];

const comments = document.querySelector(".comments");
const buttonElement = document.getElementById("add-button");
const loadingForm = document.getElementById("loadingForm");
const loading = document.getElementById("loading");
const form = document.getElementById("add-form");
const delFormBtn = document.querySelector(".del-form-button");
//const listElement = document.getElementById('list');
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
    renderComments();
  });
};
fetchGet();

const initEventListeners = () => {
  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", () => {
      likeButton.classList.add("-loading-like");
      function delay(interval = 300) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, interval);
        });
      }

      const commentBodies = document.querySelectorAll(".comment-body");
      for (const commentBody of commentBodies) {
        commentBody.addEventListener("click", () => {
          const oldComment = commentBody.dataset.text;
          const oldName = commentBody.dataset.name;
          commentInputElement.value += `${oldComment}\n${oldName}`;
        });
      }

      delay(2000).then(() => {
        const newLike = commentsArr[likeButton.dataset.index];
        newLike.likes = newLike.isLiked ? newLike.likes - 1 : newLike.likes + 1;
        newLike.isLiked = !newLike.isLiked;
        newLike.isLikeLoading = false;
        renderComments();
      });
    });
  }
};
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
    renderComments();
  }
});

delFormBtn.addEventListener("click", () => {
  commentsArr.pop();
  renderComments();
  if (!commentsArr) delFormBtn.disabled = true;
});

const renderComments = () => {
  comments.innerHTML = commentsArr
    .map((comment, index) => {
      return `<li class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body" data-text = "${
            comment.text
          }" data-name = "${comment.name}">
            <div class="comment-text">
              ${comment.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button data-index = '${index}' class="${
        comment.isLiked ? "like-button -active-like" : "like-button"
      }"></button>
            </div>
          </div>
        </li>`;
    })
    .join("");

  buttonElement.disabled = true;
  initEventListeners();
};
renderComments();

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
  renderComments();
};

buttonElement.addEventListener("click", () => {
  createNewComment();
  renderComments();
});

console.log("It works!");
