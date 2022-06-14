const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("hello express");
});

//post 관련 api
const postRouter = require("./routes/post");
app.use("/post", postRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});
