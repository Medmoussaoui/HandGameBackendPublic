# 🕹️ HandGame Backend

This is the backend for **HandGame Arena**, a real-time multiplayer Rock-Paper-Scissors elimination game designed for the web and Reddit Devvit (experimental). It handles player matchmaking, room creation, gameplay logic, and real-time communication via WebSockets.

> 🚨 **Note:** Reddit does not currently support WebSockets, so full gameplay is only available outside of Reddit for now.

---

## 🚀 Features

- 🔄 **Real-Time Gameplay** via WebSocket  
- 🎮 **Room Management** – Public and private rooms  
- 💥 **Elimination Rounds** – Players get eliminated each round  
- 🧠 **Auto-Move System** – Idle players get random moves  
- 🗃️ **MongoDB Integration** – For player, room, and game state storage  

---

## 🛠️ Tech Stack

- **Backend:** Node.js with TypeScript  
- **WebSockets:** `socket.io`  
- **Database:** MongoDB with Mongoose  
- **Hosting:** Google Cloud Run (or any Node-compatible host)

---

## 📌 Current Limitations

- ❌ **No WebSocket Support on Reddit**  
  The game is fully functional, but cannot be played directly inside Reddit yet due to WebSocket restrictions.

---

> 🎮 **Frontend Repository:**  
> 👉 [RedditHandGame (React Frontend)](https://github.com/medmoussaoui/RedditHandGame/)

---

## 📄 License

MIT
