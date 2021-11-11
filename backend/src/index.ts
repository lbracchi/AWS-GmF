import mongoose from 'mongoose'
import http from 'http'
import dotenv from 'dotenv'
import app from './app'

// express server
const httpServer: http.Server = new http.Server(app)

//interfaccia definita per creare la lista di key-value userId-socketId
let activeSockets = new Map();

import { Server, Socket } from "socket.io";
import { addMessageToChat, getDonationUsers, setMessageAsVisualized } from './controllers/donationController'
import { textChangeRangeIsUnchanged } from 'typescript'

const io = new Server(httpServer, {});
io.on("connection", (socket: Socket) => {

  /**
   * da chiamare quando l'utente si logga
   * serve per associare nel server l'id utente all'id della socket
   */
  socket.on("login", (userId: string) => {
    console.log("associato il socket-id: " + socket.id + " all'utente " + userId)
    activeSockets.set(userId, socket.id);
  })

  socket.on("logout", (userId: string) => {
    console.log("diassociato il socket-id: " + socket.id)
    activeSockets.delete(userId);
  })

  socket.on("message_to_server", (obj: any) => {
    
    console.log("message_to_server: " + obj.message)

    addMessageToChat(obj.donationId, obj.userId, obj.fullname, obj.message)
    .then(newMessage => {
      // send the new message to all the users involved in the chat (owner and optionally a volunteer)
      getDonationUsers(obj.donationId)
      .then((ids:any) => {
        if (ids) {
          const userId = ids['userId'] ? ids['userId'].toString() : null;
          const volunteerId = ids['volunteerId'] ? ids['volunteerId'].toString() : null;
          
          // send the message to the user
          if (userId && activeSockets.has(userId)) {
            console.log("sent message to user", userId)
            const destSocket = io.sockets.sockets.get(activeSockets.get(userId))
            if (destSocket) {
              destSocket.emit("chat_message", JSON.stringify(newMessage));
            }
          }

          console.log(volunteerId, activeSockets.has(volunteerId))
          // send the message to the volunteer
          if (volunteerId && activeSockets.has(volunteerId)) {
            console.log("sent message to volunteer", userId)
            const destSocket = io.sockets.sockets.get(activeSockets.get(volunteerId))
            if (destSocket) { 
              destSocket.emit("chat_message", JSON.stringify(newMessage));
            }
          }
        }
      });
    })
  });

  socket.on("visualize_message", (jsonMessage:any) => {
    const message = JSON.parse(jsonMessage)
    console.log(message)
    setMessageAsVisualized(message.donationId, message.message.index);
  });

});
httpServer.listen(3001);

dotenv.config({ path: __dirname + '/../properties.env' });

mongoose
  .connect(process.env.DB || "missing db path")
  .then(() => console.log('DB connection successfull'))