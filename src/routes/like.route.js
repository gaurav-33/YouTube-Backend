import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js"

const router = Router()

// all routes are secured
router.use(verifyJWT)
router.route("/toggleVideo/:videoId").post(toggleVideoLike)
router.route("/toggleComment/:commentId").post(toggleCommentLike)
router.route("/toggleTweet/:tweetId").post(toggleTweetLike)
router.route("/videos").get(getLikedVideos)
export default router