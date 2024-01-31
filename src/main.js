import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import path from 'path';
import MongoStore from 'connect-mongo';
import mongoConnect from './dataBase.js';
import passport from 'passport';
import initializePassport from './config/passport.js';
import staticsRouter from './router/statics.routes.js';
import router from './router/main.routes.js';


const app = express();
const PORT = 4000;

mongoConnect();

const server = app.listen(PORT, ()=>{
    console.log(`Servidor Express Puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);


app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({extended: true}));
app.use(session({ 
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL, 
        ttl: 200 
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false   
}));

initializePassport();
app.use(passport.initialize()); 
app.use(passport.session());


app.use('/static', express.static (path.join(__dirname, '/public')), staticsRouter);
app.use('/', router)
const mensajes = [];

io.on("connection", (socket)=>{
    console.log("Conexion con Socket io");
    
    socket.on ('mensaje', info =>{
        console.log(info);
        mensajes.push(info);
        io.emit('mensajes', mensajes); 
    })   


    socket.on('newProduct',  (product) => {
        console.log(product)
        socket.emit('mensajeProductoCreado', 'Prodcuto creado correctamente')
    });
});


app.get('/*',(req,res)=>{   
    res.send("Error 404: Page not found");
})