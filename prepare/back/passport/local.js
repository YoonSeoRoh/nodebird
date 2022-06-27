const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", //req.body.email
        passwordField: "password", //req.body.password
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            //사용자 존재하지 않는 경우
            //인자: 서버 에러, 성공, 클라이언트 에러(클라이언트 측에서 잘못 보낸 경우)
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }
          //사용자 존재하는 경우
          //입력된 패스워드와 db에 저장된 패스워드 비교
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            //비밀번호 일치할 경우
            //사용자 정보를 넘김
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
