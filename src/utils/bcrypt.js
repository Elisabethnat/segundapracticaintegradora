import 'dotenv/config.js'; 
import bcrypt from 'bcrypt';


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)));

const hashPasword = createHash('Coder');

export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD);