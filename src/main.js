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
// import multer from 'multer';
// import { userModel } from './models/users.model.js';

const app = express();
const PORT = 4000;
//conexion a atlas
mongoConnect();
//Server
const server = app.listen(PORT, ()=>{
    console.log(`Servidor Express Puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);

//middlewares
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));//se firma la cookie para q no puedan modificarla
app.use(express.urlencoded({extended: true}));
app.use(session({ //Config session en app en mongo
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL, 
        ttl: 200 //time to live en seg
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,//estaban en false
    saveUninitialized: true
}));

app.engine('handlebars', engine()); //defino que trabajo con habndlebars y guardo config de engine
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); //esta es otra forma de trabajar con rutas
// const upload = multer({ storage: storage});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //Permite que la sesion permanezca activa en caso de estar inactivo. Con false muere la sesión
    saveUninitialized: false //Permite guardar cualquier sesion aun cuando el objeto de sesion no tengo nada por contener   
}));

initializePassport(); // se aplica esta estrategia de login 
app.use(passport.initialize()); //se inicializa passport
app.use(passport.session()); //se inicializa para trabajar con las sesiones de mis usuarios

//Routes
app.use('/static', express.static (path.join(__dirname, '/public')), staticsRouter);
app.use('/', router)
const mensajes = [];
//Conexion Socket.io
io.on("connection", (socket)=>{
    console.log("Conexion con Socket io");
    
    socket.on ('mensaje', info =>{
        console.log(info);
        mensajes.push(info);
        io.emit('mensajes', mensajes); // emito el array de mensajes
    })   
    // socket.on('load', async () => {
    //     const products = await productManager.getProducts();
    //     socket.emit('products', products);
    // });
    
    // socket.on('newProduct', async product => {
    //     await productManager.addProducts(product);
    //     const products = await productManager.getProducts();
    //     socket.emit('products', products);
    // });    

    socket.on('newProduct',  (product) => {
        console.log(product)
        socket.emit('mensajeProductoCreado', 'Prodcuto creado correctamente')
    });
});


app.get('/*',(req,res)=>{   //Ruta con error 404 que se utiliza a nivel general
    res.send("Error 404: Page not found");
})