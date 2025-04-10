import express from 'express';
import { StatusCodes } from 'http-status-codes';



// import mailer from './config/mailConfig.js'
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRoutes.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  


app.use('/api',apiRouter)

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
  connectDB();
  // const mailResponse = await mailer.sendMail({
  //   from: 'gk064577@gmail.com',
  //   to:'abhishekchauhan244235@gmail.com',
  //   subject:'welcome mail',
  //   text:'How are you man'
    
  // })

  // console.log(mailResponse);
});
