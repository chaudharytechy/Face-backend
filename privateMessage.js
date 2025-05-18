// import { Server } from 'socket.io';
// import jwt from 'jsonwebtoken';
// import cookie from 'cookie'; // Ensure this is imported

// const userSocketMap = {};

// const setupPrivateMessaging = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: 'http://localhost:3000',
//       credentials: true,
//     },
//   });

//   io.use((socket, next) => {
//     try {
//       const rawCookie = socket.handshake.headers.cookie;
//       if (!rawCookie) {
//         console.log("❌ No cookie found in headers");
//         return next(new Error("No cookie found"));
//       }

//       const parsedCookies = cookie.parse(rawCookie);
//       const token = parsedCookies.authToken;

//       if (!token) {
//         console.log("❌ No authToken in cookie");
//         return next(new Error("No authToken cookie found"));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
//       console.log("✅ Decoded JWT:", decoded); // LOG THIS

//       socket.user = decoded;
//       next();
//     } catch (err) {
//       console.error("❌ Socket auth error:", err.message);
//       next(new Error("Authentication failed"));
//     }
//   });

//   io.on('connection', (socket) => {
//     const userId = socket.user?._id || socket.user?.id; // safer access
//     console.log(`✅ User connected: ${userId}`);

//     if (!userId) {
//       console.log("❌ No user ID found on socket.user");
//       return;
//     }

//     userSocketMap[userId] = socket.id;

//     socket.on('send_message', ({ to, message }) => {
//       const toSocketId = userSocketMap[to];
//       const from = userId;
//       console.log(`📨 Message sent from ${from} to ${to}:`, message);
//       if (toSocketId) {
//         io.to(toSocketId).emit('message', { from, message });
//       } else {
//         console.log(`⚠️ User ${to} is offline`);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log(`🔌 Disconnected: ${userId}`);
//       delete userSocketMap[userId];
//     });
//   });
// };

// export default setupPrivateMessaging;



import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie'; // Ensure this is imported

// A map to track user IDs and socket IDs.
const userSocketMap = {};

const setupPrivateMessaging = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  // Middleware for authentication using JWT
  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) {
        console.log("❌ No cookie found in headers");
        return next(new Error("No cookie found"));
      }

      const parsedCookies = cookie.parse(rawCookie);
      const token = parsedCookies.authToken;

      if (!token) {
        console.log("❌ No authToken in cookie");
        return next(new Error("No authToken cookie found"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
      console.log("✅ Decoded JWT:", decoded); // Log decoded token for debugging

      socket.user = decoded; // Store user information in the socket object
      next();
    } catch (err) {
      console.error("❌ Socket auth error:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  // When a user connects
  io.on('connection', (socket) => {
    const userId = socket.user?._id || socket.user?.id; // safer access
    console.log(`✅ User connected: ${userId}`);

    // If the userId is not found, exit early
    if (!userId) {
      console.log("❌ No user ID found on socket.user");
      return;
    }

    // Register the socket ID for this user
    userSocketMap[userId] = socket.id;
    console.log(`📝 Registered user ${userId} with socket ID ${socket.id}`);

    // Handle sending messages
    socket.on('send_message', ({ to, message }) => {
      const toSocketId = userSocketMap[to]; // Find recipient's socket ID
      const from = userId;

      console.log(`📨 Message sent from ${from} to ${to}:`, message);

      // Check if the recipient is online
      if (toSocketId) {
        io.to(toSocketId).emit('message', { from, message });
        console.log(`✅ Message delivered to ${to}`);
      } else {
        console.log(`⚠️ User ${to} is offline`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User ${userId} disconnected with socket ID ${socket.id}`);
      delete userSocketMap[userId]; // Remove the user from userSocketMap on disconnect
    });
  });
};

export default setupPrivateMessaging;
