const socket = io();

function uploadPost() {
  const fileInput = document.getElementById('fileInput');
  const description = document.getElementById('description').value;

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const imageData = event.target.result;
      const post = { image: imageData, description };
      socket.emit('uploadPost', post);
    };
    reader.readAsDataURL(file);
  }
}

socket.on('newPost', (post) => {
  const postsContainer = document.getElementById('posts');
  const postElement = document.createElement('div');
  postElement.classList.add('post');
  postElement.innerHTML = `
    <img src="${post.image}" alt="Post Image">
    <p>${post.description}</p>
    <div class="actions">
      <button onclick="likePost('${post.id}')">Like</button>
      <span>Likes: <span id="likesCount${post.id}">0</span></span>
      <input type="text" id="commentInput${post.id}" placeholder="Add a comment">
      <button onclick="addComment('${post.id}')">Comment</button>
      <div id="comments${post.id}"></div>
    </div>
  `;
  postsContainer.appendChild(postElement);
});

function likePost(postId) {
  socket.emit('likePost', postId);
}

function addComment(postId) {
  const commentInput = document.getElementById(`commentInput${postId}`);
  const comment = commentInput.value;
  if (comment.trim() !== '') {
    socket.emit('addComment', { postId, comment });
    commentInput.value = '';
  }
}

socket.on('updateLikes', (postId, likes) => {
  const likesCountElement = document.getElementById(`likesCount${postId}`);
  likesCountElement.textContent = likes;
});

socket.on('newComment', (postId, comment) => {
  const commentsContainer = document.getElementById(`comments${postId}`);
  const commentElement = document.createElement('p');
  commentElement.textContent = comment;
  commentsContainer.appendChild(commentElement);
});
