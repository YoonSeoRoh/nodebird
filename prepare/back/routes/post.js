//post 관련 api
const express = require("express");
const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

router.get("/post", (req, res) => {});

//포스트 생성 -> 로그인 한 사람들만
router.post("/", isLoggedIn, async (req, res, next) => {
  // POST/post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    //포스트를 프론트로 넘김
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//댓글 생성 -> 로그인 한 사람들만
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // POST/post/post.id/comment
  try {
    //주소 검사 -> 존재하는 게시글인지
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    //포스트가 존재하지 않는 경우
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    //포스트를 프론트로 넘김
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/post", (req, res) => {});

module.exports = router;
