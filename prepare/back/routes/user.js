//user 관련 api
const express = require("express");
const bcrypt = require("bcrypt");
const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

//회원가입 -> 로그인 안한 사람들만
router.post("/", isNotLoggedIn, async (req, res, next) => {
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

//로그인 -> 로그인 안한 사람들만
//미들웨어 확장(passport에서 req, res, next를 쓸 수 있도록)
const passport = require("passport");
router.post("/login", isNotLoggedIn, (req, res, next) => {
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
      //비밀번호는 넘기지 않고 포스트와 팔로윙 팔로워는 포함
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

//로그아웃 -> 로그인 한 사람들만
//세션 삭제
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout(() => {});
  req.session.destroy();
  res.send("ok");
});

//사용자 정보를 복구 -> 새로고침해도 로그인 상태 유지 -> 사용자 로그인이 되어 있을 경우에만
router.get("/", async (req, res, next) => {
  // GET/user
  try {
    if (req.user) {
      //로그인이 되어 있다면 사용자 정보 보냄
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"], //필요한 데이터만 -> id만 알아도 몇명인지, 몇개인지 알 수 있음
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      //로그인이 되어 있지 않다면 아무것도 보내지 않음
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//닉네임 수정
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        //수정
        nickname: req.body.nickname, //무엇을 -> 닉네임을 프론트에서 받은 닉네임으로
      },
      {
        where: { id: req.user.id }, //조건 -> 내 아이디의 닉네임을 수정
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로우
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH/user/userId/follow
  try {
    //해당 유저가 있는지 확인
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사용자입니다.");
    }
    await user.addFollowers(req.user.id); //상대방의 팔로워 목록에 나를 추가
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); //팔로우 대상의 아이디를 반환
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로우 취소
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    //해당 유저가 있는지 확인
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사용자입니다.");
    }
    await user.removeFollowers(req.user.id); //상대방의 팔로워 목록에 나를 추가
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); //팔로우 대상의 아이디를 반환
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
