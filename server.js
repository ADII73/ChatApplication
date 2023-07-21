const path=require('path');   // require the path module to join with the static file
const http=require('http');   // require http module to create server
const express = require('express');   //adding express module
const socketio=require('socket.io');   // require socket.io moddule
const formatMessage=require('./utils/messages');   // import formatmessage function from utils for time
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');


const app=express();   // initializing express to app variable
const server=http.createServer(app);   // in the server we are providing app (exprss) to run on the server
const io=socketio(server);   // initialize socketio with variable io and pass into the server



app.use(express.static(path.join(__dirname,'public'))); 
//set static folder (serve static file through express)
//'use' module in express to serve static file
//'path' module to give the path
//'__dirname'is the name of the current directory in which the file is present, if present in other directory then that name would have in given
//'public' is the static folder name


const botName='Chat Bot';

    // run when client connects
    io.on('connection',socket=>{    //io object .on (which will listen some kind of events)i.e listen for connection event. socket arrow function


        socket.on('joinRoom',({username,room})=>{  
        const user=userJoin(socket.id,username,room);

        socket.join(user.room);


        socket.join();
    
        //welcome current user(emit will send mssg to single user or client)
        socket.emit('message',formatMessage(botName,'Welcome to chatcord'));
    
    
    
        // broadcast(it will notify everyone except the user is connecting )
        socket.broadcast
        .to(user.room)
        .emit(
        'message',
        formatMessage(botName,`${user.username} has joined`)
        );
        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)   
        });
    });

    //listen for chatmessage
    socket.on('chatmessage',msg=>{
        const user=getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });


    //runs when client disconnects
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

        if(user){
            io.to(user.room).emit(
                'message',
                formatMessage(botName,`${user.username} has left the chat`)
            );
            // send users and room info
            io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)   
            });
        }
    });
});

const PORT=3000;   // the application expects environment variable name PORT

server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));  // listening to port