const express = require("express")
const cookieSession = require('cookie-session')
const cors = require('cors')
require("dotenv").config();
const authState = require('./middleware/authorize')
const userRouter = require('./routes/route.user')
const authRouter = require('./routes/route.auth')
const ridesRouter = require('./routes/route.rides')
const adminRouter = require('./routes/route.admin')
const dbConnect = require('./db');
// const session = require('expres-session')
const app = express()

app.use(express.json());
app.disable('x-powered-by')

app.use(cookieSession({
  name:'usrSID',
  // keys:['key1'],
  secret:process.env.COOKIE_SECRET,
}));

app.use(cors())
app.use('/api/auth', authRouter)
app.use(authState)
app.use('/api/user', userRouter)
app.use('/api/logout', (req,res)=>{
  req.session = null;
  res.status(200).send("Session terminated.")
})
app.use('/api/rides', ridesRouter)
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT;

async function start(){
  try {
    await dbConnect(process.env.MONGO_URI);
    // console.log(`Connection to DB established successfully...`)
    app.listen(PORT, () => console.log(`Server live... \nlistening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
}

start();