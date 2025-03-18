import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content.trim()) {
        throw new ApiError(400, "Content is required.")
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    if (!tweet) {
        throw new ApiError(400, "Error while creating tweet.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { tweet }, "Tweet created successfully."))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({
        owner: req.user._id
    }).sort({ createdAt: -1 })
    return res
        .status(200)
        .json(new ApiResponse(200, { tweets }, "Users tweets fetched successfully."))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content, tweetId } = req.body
    if (!content.trim() || !tweetId.trim()) {
        throw new ApiError(400, "All fields are required.")
    }
    const tweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        })
    if (!tweet) {
        throw new ApiError(400, "No tweet found.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { tweet }, "Tweet updated successfully."))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.query
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if (!tweet) {
        throw new ApiError(400, "No tweet found.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { tweet }, "Tweet deleted successfully."))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}