import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
} from "../controllers/user.controller.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, changeCurrentPassword)
router.route("/currentUser").get(verifyJWT, getCurrentUser)
router.route("/updateAccountDetails").patch(verifyJWT, updateAccountDetails)
router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/updateCoverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchHistory/:username").get(verifyJWT, getWatchHistory)


export default router