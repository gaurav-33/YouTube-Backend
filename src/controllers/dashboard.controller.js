import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const totalVideos = await Video.countDocuments({ owner: req.user._id });
    const totalSubscribers = await Subscription.countDocuments({ channel: req.user._id });
    const totalLikes = await Like.countDocuments({ likedBy: req.user._id });

    const totalViews = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalLikes,
            totalViews: totalViews[0]?.totalViews || 0,
        }, "Channel stats fetched successfully.")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {

    const videos = await Video.find({
        owner: req.user._id,
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { videos }, "Channel videos fetched successfully."))
})

export {
    getChannelStats,
    getChannelVideos
}