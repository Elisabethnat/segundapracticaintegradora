import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";

const sessionRouter = Router();
 //Ruta para crear el login del usuario con passport
sessionRouter.post('/login', passport.authenticate('login'), (req, res) => {
  try {
    if (!req.user) {
        res.status(401).send({mensaje: "Invalidate user"});
    } //creo la session
    req.session.user = {
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    //genero el token cuando inicio la session
    const token = generateToken(req.user);
    //una vez q generamos el token se lo respondo a las cookies
    res.cookie('jwtCookie', token, {
      maxAge: 43200000
    });

    res.status(200).send ({payload: req.user });
  } catch (error) {
    res.status(500).send({mensaje: `Error al inicializar sesion ${error}`});
  };
});

sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res)=> {
    res.send(req.user);
})

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req,res)=>{
    res.status(200).send({ mesaje: req.user });
    console.log(req.user.user)
    req.session.user = {
      first_name : req.user.user.first_name,
      last_name : req.user.user.last_name,
      age: req.user.user.age,
      email: req.user.user.email
  };
});

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res)=>{
  res.status(200).send({mensaje: "Usuario Creado"});
});

sessionRouter.get('/githubSession', passport.authenticate('github', {scope: ['user:email']}), async (req, res)=>{
  req.session.user = req.user
  res.redirect('/static/home'); //Redirigimos al usuario a home una vez inicia sesion correctamente
  // res.status(200).send({mensaje: "Session created"});
});

sessionRouter.get('/logout', (req, res) => {
  if (req.session.user) {
      try {
          req.session.destroy()
          res.clearCookie('jwtCookie');
          res.status(200).send({ resultado: 'Has cerrado sesion' })
          res.redirect("/static/signin");
      }
      catch (error) {
          res.status(400).send({ error: `Error al cerrar sesion: ${error}` });
      }
  } else {
      res.status(400).send({ error: `No hay sesion iniciada` });
  };
});

export default sessionRouter;