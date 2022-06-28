const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  //쿠기와 묶어줄 아이디만 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //아이디를 통해서 유저 정보 복구
  //로그인 후 실행
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
      });
      done(null, user); //req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  local();
};
