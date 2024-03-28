const socket = io('ws://localhost:3500')

// Select elements from the DOM
const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')
const recipientSelect = document.querySelector('#recipient');

function enterRoom(e) {
  e.preventDefault()
  if (nameInput.value && chatRoom.value) {
      socket.emit('enterRoom', {
          name: nameInput.value,
          room: chatRoom.value
      })
  }
}

function sendMessage(e) {
  e.preventDefault();
  if (nameInput.value && msgInput.value && chatRoom.value) {
    const recipient = recipientSelect.value;

    if (recipient === 'everyone') {
      // Send message to everyone in the room
      socket.emit('message', {
        name: nameInput.value,
        text: msgInput.value,
      });
    } else {
      // Send private message to the selected recipient
      socket.emit('privateMessage', {
        sender: nameInput.value,
        recipient: recipient,
        text: msgInput.value,
      });
    }

    msgInput.value = '';
  }
  msgInput.focus();
}

// Event listeners for sending messages and entering rooms
document.querySelector('.form-msg').addEventListener('submit', sendMessage)
document.querySelector('.form-join').addEventListener('submit', enterRoom)

// Event listener for typing activity
msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for messages 
socket.on("message", (data) => {
  // Clear any previous activity text
  activity.textContent = ""

  // Destructure data object into variables
  const { name, text, time } = data

  // Create a new list item element and give it 'post' class for styling
  const li = document.createElement('li')
  li.className = 'post'

  // Apply correct styling to the messages based on the sender's name
  if (name === nameInput.value) 
      li.className = 'post post--left' // Left align message if sender is the current user

  if (name !== nameInput.value && name !== 'Admin') 
      li.className = 'post post--right' // Right align message if sender is not the current user or 'Admin'

  // Check if sender is not 'Admin', add sender's name and time, else only add the message
  if (name !== 'Admin') {
      li.innerHTML = `<div class="post__header ${name === nameInput.value
          ? 'post__header--user' // If sender is current user, apply 'post__header--user' class
          : 'post__header--reply' // If sender is not current user, apply 'post__header--reply' class
          }">
      <span class="post__header--name">${name}</span> 
      <span class="post__header--time">${time}</span> 
      </div>
      <div class="post__text">${text}</div>`
  } else {
      li.innerHTML = `<div class="post__text">${text}</div>`
  }

  // Append the new list item to the chat display area
  document.querySelector('.chat-display').appendChild(li)

  // Automatically scroll chat display to the bottom to show the latest message
  chatDisplay.scrollTop = chatDisplay.scrollHeight
})

// Listen for private messages
socket.on('privateMessage', (data) => {
  activity.textContent = "";
  const { name, text, time } = data;
  const isCurrentUser = name === nameInput.value;

  const li = document.createElement('li');
  li.className = isCurrentUser ? 'post post--left' : 'post post--right';

  if (name !== 'Admin') {
    const headerClass = isCurrentUser ? 'post__header--user' : 'post__header--reply';
    const nameDisplay = `${name} (private)`;

    li.innerHTML = `<div class="post__header ${headerClass}">
        <span class="post__header--name">${nameDisplay}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`;
  } else {
    li.innerHTML = `<div class="post__text">${text}</div>`;
  }

  document.querySelector('.chat-display').appendChild(li);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// Setup event listeners for sockets to show users, when they are typing and rooms
let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`

    // Clear after 3 seconds 
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
})

socket.on('userList', ({ users }) => {
  showUsers(users);
  populateRecipients(users);
});

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms)
})

// Enable the send button when the user joins a room
socket.on('enterRoom', () => {
  document.getElementById('sendButton').disabled = false;
});

// Lists the users in the current room
function showUsers(users) {
    usersList.textContent = ''
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

// Lists the room names currently in use
function showRooms(rooms) {
    roomList.textContent = ''
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}

// Function to populate the recipient dropdown with usernames
function populateRecipients(users) {
  recipientSelect.innerHTML = ''; // Clear existing options
  const everyoneOption = document.createElement('option');
  everyoneOption.value = 'everyone';
  everyoneOption.textContent = 'Everyone';
  recipientSelect.appendChild(everyoneOption); // Add "Everyone" option

  // Add users online
  users.forEach(user => {
    if (user.name !== nameInput.value) { // Exclude user's own name
      const userOption = document.createElement('option');
      userOption.value = user.name;
      userOption.textContent = user.name;
      recipientSelect.appendChild(userOption);
    }
  });
}