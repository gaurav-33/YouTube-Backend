import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId.trim()) {
        throw new ApiError(400, "VideoId is missing.")
    }
    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
    })

    if (existingLike) {
        const likedVideo = await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, { likedVideo }, "Video Unliked successfully."))
    } else {
        const likedVideo = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        if (!likedVideo) {
            throw new ApiError(400, "Video does not exists.")
        }
        return res.status(200).json(new ApiResponse(200, { likedVideo }, "Video liked successfully."))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId.trim()) {
        throw new ApiError(400, "CommentId is missing.")
    }
    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId
    })

    if (existingLike) {
        const likedCommnet = await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, { likedCommnet }, "Comment Unliked successfully."))
    } else {
        const likedCommnet = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        if (!likedCommnet) {
            throw new ApiError(400, "Comment does not exists.")
        }
        return res.status(200).json(new ApiResponse(200, { likedCommnet }, "Comment liked successfully."))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId.trim()) {
        throw new ApiError(400, "TweetId is missing.")
    }
    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        tweet: tweetId
    })

    if (existingLike) {
        const likedTweet = await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200, { likedTweet }, "Tweet Unliked successfully."))
    } else {
        const likedTweet = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        if (!likedTweet) {
            throw new ApiError(400, "Tweet does not exists.")
        }
        return res.status(200).json(new ApiResponse(200, { likedTweet }, "Tweet liked successfully."))
    }
}
)
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true } // Ensure only likes associated with videos are fetched
    }).populate('video') // Populate video details if needed

    if (!likedVideos || likedVideos.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No liked videos found."));
    }

    return res.status(200).json(new ApiResponse(200, { likedVideos }, "Liked videos retrieved successfully."));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}