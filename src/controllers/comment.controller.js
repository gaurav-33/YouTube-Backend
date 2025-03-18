import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10, sortBy = 'createdAt', sortType = 'desc' } = req.query

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: sortType === 'asc' ? 1 : -1 },
    }


    const aggregation = await Comment.aggregate([
        {
            $match: {
                video: videoId
            }
        }
    ])

    Comment.aggregatePaginate(aggregation, options, (err, result) => {
        if (result) {
            return res.status(200).json(new ApiResponse(200, { result }, "Comments fetched successfully."))
        }
        throw new ApiError(500, err.message || "Error while aggregating comments.")
    })

})

const addComment = asyncHandler(async (req, res) => {
    const { content, videoId } = req.body
    if (!content.trim() && !videoId.trim()) {
        throw new ApiError(400, "Content and VideoId is required.")
    }
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })
    if (!comment) {
        throw new ApiError(400, "Error while adding Comment.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { comment }, "Tweet created successfully."))
})

const updateComment = asyncHandler(async (req, res) => {
    const { content, commentId } = req.body
    if (!content.trim() || !commentId.trim()) {
        throw new ApiError(400, "All fields are required.")
    }
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        })
    if (!comment) {
        throw new ApiError(400, "No tweet found.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { comment }, "Comment updated successfully."))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if (!comment) {
        throw new ApiError(400, "No tweet found.")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { comment }, "Comment deleted successfully."))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}