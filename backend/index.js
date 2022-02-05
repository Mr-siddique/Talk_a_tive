const express=require('express');
const dotenv=require('dotenv');
const userRoutes=require('./routes/userRoutes');
const chats=require('./data/data');
const app=express();
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
dotenv.config();

require('./config/db')();

app.use(express.json({limit:'50mb'}));  //to accept jsondata

app.get('/',(req,res)=>{
    res.send('API is running')
})

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT||5000;
const server= app.listen(PORT,console.log("server is running on port "+PORT));

const io=require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            autoConnect: true,
            pingInterval: 25000,
            pingTimeout: 180000,
    },
    allowEIO3: true,
    cookie: {
        name: "domainio",
        httpOnly: false,
        secure: true
      },
      maxHttpBufferSize: 1e8
    });
io.on('connection',(socket)=>{
    console.log('connected with webSocket');
    socket.on('setup',(user)=>{
        socket.join(user._id);
        socket.emit('connected');
    });
    // socket.on('setup',(chat)=>{
    //     console.log(chat);
    //     socket.join(chat._id);
    //     socket.emit('connected');
    // })
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log(`Room joined ${room}`);
    })
    socket.on('typing',(room)=>socket.in(room).emit('typing'));
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'));
    socket.on('new message',(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.users) return console.log('chat.users is notdefined');
        chat.users.forEach(function(user){
            if(user._id==newMessageReceived.sender._id) return;
            socket.in(user._id).emit('message received',newMessageReceived);
        })
    })
    // socket.on('new message',(newMessageReceived)=>{
    //     var chat=newMessageReceived.chat;
    //     if(!chat.users) return console.log('chat.users is not defined');
    //     socket.broadcast.to(newMessageReceived.chat._id).emit('message received',newMessageReceived);
    // })
    socket.off('setup',()=>{
        console.log('user disconnected');
        socket.leave(user._id)
    })
})

