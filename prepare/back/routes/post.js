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
          include: [
            {
              model: User, //댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, //게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, //좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    //포스트를 프론트로 넘김
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//포스트 삭제
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  // DELETE/post/postId
  try {
    await Post.destroy({
      where: { id: req.params.postId },
      UserId: req.user.id, //내가 쓴 게시글만 삭제 가능
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
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
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    //포스트를 프론트로 넘김
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//좋아요 추가
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  // PATCH/post/postId/like
  try {
    //포스트가 있는지 검사
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//좋아요 삭제
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  // DELETE/post/postId/like
  try {
    //포스트가 있는지 검사
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
