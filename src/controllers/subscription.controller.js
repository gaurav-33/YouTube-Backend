import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.query
    if (!channelId) {
        throw new ApiError(400, "ChannelId is required.")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existingSubscription) {
        await Subscription.deleteOne({ _id: existingSubscription._id })
        return res
            .status(200)
            .json(new ApiResponse(200, { existingSubscription }, "Channel unsubscribed successfully."))
    } else {
        const subscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })

        if (!subscription) {
            throw new ApiError(400, "Channel does not exist.")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, { subscription }, "Channel subscribed successfully."))
    }
})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscription.find(
        {
            channel: req.user._id
        }
    ).select("-password -refreshToken")
    return res
        .status(200)
        .json(new ApiResponse(200, { subscribers }, "List of subscribers fetched successfully."))
})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const channels = await Subscription.find(
        {
            subscriber: req.user._id
        }
    ).select("-password -refreshToken")
    return res
        .status(200)
        .json(new ApiResponse(200, { channels }, "List of channels fetched successfully."))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}