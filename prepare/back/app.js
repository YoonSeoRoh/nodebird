const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello express");
});

//.env
const dotenv = require("dotenv");
dotenv.config();

//서버 실행 시 db sequelize 연결도 동시에 진행
const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

//cors 설정
//origin: true로 설정해두면 * 대신 보낸 곳의 주소가 자동으로 들어감
//-> 쿠기를 주고 받을 경우에는 *(wildcard) 사용 금지 -> 민감한 정보를 주고받기 때문
//-> 정확한 주소를 적어주는 것이 좋음 or true도 괜찮긴 함
//credentials: true -> 쿠키 전달 가능
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//passport
const passport = require("passport");
const passportConfig = require("./passport");
passportConfig();

//프론트에서 보낸 데이터를 req.body에 넣어주는 역할
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser("nodebirdsecret"));

//session 설정
const session = require("express-session");
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//post 관련 api
const postRouter = require("./routes/post");
app.use("/post", postRouter);

//user 관련 api
const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});
