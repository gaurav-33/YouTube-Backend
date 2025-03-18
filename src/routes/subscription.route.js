import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
} from "../controllers/subscription.controller.js"

const router = Router()

// all routes are secured
router.use(verifyJWT)

router.route("/toggle").post(toggleSubscription)
router.route("/userSubscriber").get(getUserChannelSubscribers)
router.route("/channels").get(getSubscribedChannels)

export default router