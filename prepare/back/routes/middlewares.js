//로그인 되어 있는지를 검사
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); //인자가 아무것도 없으면 다음 미들웨어로
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};
//로그인 되어 있지 않은지를 검사
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
