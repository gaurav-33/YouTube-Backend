import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js"

const router = Router()

// all routes are secured
router.use(verifyJWT)

router.route("/add").post(addComment)
router.route("/getAll/:videoId").post(getVideoComments)
router.route("/update").patch(updateComment)
router.route("/delete/:commentId").delete(deleteComment)


export default router