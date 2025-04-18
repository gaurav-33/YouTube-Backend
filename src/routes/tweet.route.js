import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js"

const router = Router()

// all routes are secured
router.use(verifyJWT)

router.route("/create").post(createTweet)
router.route("/userTweets").get(getUserTweets)
router.route("/update").patch(updateTweet)
router.route("/delete/:tweetId").delete(deleteTweet)

export default router