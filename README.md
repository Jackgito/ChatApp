## Chat Application

This is a simple real-time chat application built with Node.js, Express, and Socket.IO. Users can join different chat rooms, send public messages to everyone in the room, and send private messages to specific users. The application also provides feedback when users are typing.

### Credits

This project was built using [gitdagray/build-chat-app](https://github.com/gitdagray/build-chat-app) as a foundation.

### Getting Started

1. Clone the repository.
2. Install dependencies by running `npm install`.
3. Start the server with `npm start`.
4. Open your browser and navigate to `http://localhost:3500`.

### Usage

- Enter your name and choose a chat room to join.
- Start sending messages in the chat room.
- You can send public messages that everyone in the room can see or private messages to specific users.

### Code Structure

- `index.js`: Contains the server-side logic written in Node.js and Express. It handles user connections, message broadcasting, room management, and user activity.
- `app.js`: Contains the client-side logic written in JavaScript. It handles user interactions, such as sending messages, joining chat rooms, and displaying messages.

### Features

- Real-time messaging: Messages are delivered instantly to all users in the same chat room.
- Public and private messaging: Users can send messages to everyone in the room or privately to specific users.
- User activity indication: The application displays when users are typing in the chat room.
- Room and user management: Users can join different chat rooms, and the application tracks active users in each room.