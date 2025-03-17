import { Router } from "express"
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()


// secured routes
router.route("/allVideo").get(verifyJWT, getAllVideos)
router.route("/publish").post(verifyJWT, upload.fields([
    {
        name: "video",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }]), publishAVideo)

router.route("/d/:videoId").get(verifyJWT, deleteVideo)
router.route("/togglePublishStatus/:videoId").patch(verifyJWT, togglePublishStatus)
router.route("/v/:videoId").get(getVideoById)
router.route("/update").patch(verifyJWT, upload.single("thumbnail"), updateVideo)

export default router