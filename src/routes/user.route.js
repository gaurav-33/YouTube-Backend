import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetail,
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
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser)
router.route("/updateAccountDetail").post(verifyJWT, updateAccountDetail)
router.route("/updateAvatar").post(upload.single("avatar"), updateUserAvatar)
router.route("/updateCoverImage").post(upload.single("coverImage"), updateUserCoverImage)


export default router