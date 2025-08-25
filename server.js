const express = require('express');
const swaggerDocs = require("./swagger.js");
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/connection');
connectToDb();

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(cookieParser());

const userRoute = require('./routes/user.route.js');
app.use('/api/v1/users', userRoute);

const quizRoute = require('./routes/quiz.route.js');
app.use('/api/v1/quiz', quizRoute);

const submissionRoute = require('./routes/submission.route.js');
app.use('/api/v1/submission', submissionRoute);

const leaderboardRoute = require('./routes/leaderboard.route.js');
app.use('/api/v1/leaderboard', leaderboardRoute);

const hintRoute = require('./routes/hint.route.js');
app.use('/api/v1/hint', hintRoute);

const errorMiddleware = require('./middlewares/error.middlware.js');
app.use(errorMiddleware);

swaggerDocs(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
