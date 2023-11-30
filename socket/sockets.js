const sockets = (socket) => {
  // socket.on("setup", (userData) => {
  //   socket.join(userData.id);
  //   socket.emit("connected");
  // });

  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("close chat", (room) => {
    console.log("leaved room ", room);
    socket.leave(room);
  });
  // socket.on("typing", (room) => socket.in(room).emit("typing"));
  // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const { message, chat } = newMessageRecieved;

    if (!chat.members) return console.log("chat.members not defined");

    // chat.members.forEach((member) => {
    //   if (member.id == message.senderID) return;
    //   console.log(`emitted to member ${member.id}`);
    //   socket.in(member.id).emit("message recieved", message);
    // });

    socket.in(message.chatID).emit("message recieved", message);
  });

  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData.id);
  // });
};

module.exports = sockets;
