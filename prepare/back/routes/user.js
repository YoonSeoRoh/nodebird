//user 관련 api
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

//회원가입
router.post("/", async (req, res, next) => {
  // POST/user
  try {
    //async await -> 비동기 방지 -> 붙이지 않으면 res.send()이 먼저 실행됨
    //이메일 중복 확인
    //프론트에서 보낸 이메일을 가진 사용자가 있는지 찾음
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    //회원정보 생성
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok"); //성공
  } catch (error) {
    console.error(error);
    next(error); //status 500, express가 에러 처리
  }
});

//로그인
//미들웨어 확장(passport에서 req, res, next를 쓸 수 있도록)
const passport = require("passport");
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    //전달된 서버에러+user객체+클라이언트에러
    if (err) {
      //서버에러
      console.error(err);
      return next(err);
    }
    if (info) {
      //클라이언트에러
      return res.status(401).send(info.reason);
    }
    //성공하면
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        //passport에서의 로그인 에러가 날 경우
        console.error(loginErr);
        return next(loginErr);
      }
      //사용자 정보를 프론트로 넘김
      return res.status(200).json(user);
    });
  })(req, res, next);
});

//로그아웃
router.post("/user/logout", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
