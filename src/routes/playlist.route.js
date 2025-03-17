import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js"

const router = Router()

// all routes are secured
router.use(verifyJWT)

router.route("/create").post(createPlaylist)
router.route("/userVideo").get(getUserPlaylists)
router.route("/id/:playlistId").get(getPlaylistById)
router.route("/addVideo").patch(addVideoToPlaylist)
router.route("/removeVideo").patch(removeVideoFromPlaylist)
router.route("/delete").get(deletePlaylist)
router.route("/update").patch(updatePlaylist)

export default router