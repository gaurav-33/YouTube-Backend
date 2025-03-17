import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js"
import { ApiResponse } from "../utils/apiResponse.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if ([name, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "Playlist created successfully."))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const playlists = await Playlist.find({ owner: userId })

    return res
        .status(200)
        .json(new ApiResponse(200, { playlists }, "User Playlist fetched successfully."))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) {
        throw new ApiError(400, "Playlist id is missing.")
    }

    const playlist = await Playlist.findById(playlistId)
    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "Playlist fetched successfully."))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.query
    if (!playlistId || !videoId) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $push: { videos: videoId }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "Video added to playlist successfully."))
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.query
    if (!playlistId || !videoId) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $pull: { videos: videoId }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "Video removed from playlist successfully."))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.query
    if (!playlistId) {
        throw new ApiError(400, "PlylistId is required.")
    }

    const playlist = await Playlist.findOneAndDelete(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "Playlist deleted successfully."))


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.query
    const { name, description } = req.body
    if (!playlistId) {
        throw new ApiError(400, "PlylistId is required.")
    }
    if ([name, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )
    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "Playlist updated successfully."))

})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}