export const renderComments = ({ commentsArr }) => {
    let comments = document.querySelector(".comments");
    comments.innerHTML = commentsArr.map((comment, index) => {
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
  
    initEventListeners({ commentsArr });
  };

  const initEventListeners = ({ commentsArr }) => {
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
          renderComments({ commentsArr });
        });
      });
    }
  };