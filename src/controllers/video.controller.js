import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = 'createdAt', sortType = 'desc', userVideo } = req.query

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: sortType === 'asc' ? 1 : -1 },
    }

    const matchStage = { $match: {} }


    if (query.trim()) {
        matchStage.$match = {
            isPublished: true,
            $text: { $search: query }

        }
    }

    if (userVideo === "true") {
        if (!req.user?._id) {
            throw new ApiError(401, "Unauthorized Request.")
        }
        matchStage.$match.owner = req.user._id
        delete matchStage.$match.isPublished
    }
    if (userVideo === "true" && !query.trim()) {
        delete matchStage.$match.$or
    }
    if (userVideo !== "true" && !query.trim()) {
        throw new ApiError(400, "Atleast query is required.")
    }


    const aggregation = await Video.aggregate([
        matchStage
    ])

    Video.aggregatePaginate(aggregation, options, function (err, result) {
        if (result) {
            return res.status(200).json(new ApiResponse(200, { result }, "Videos fetched successfully."))
        }
        throw new ApiError(500, err.message || "Error while aggregating videos.")
    })

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body

    const isPublish = isPublished.trim() === "false" ? false : true
    if ([title, description].some((fieled) => fieled?.trim() === "")) {
        throw new ApiError(400, "All fields are required.")
    }
    let videoLocalPath
    let thumbnailLocalPath

    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        videoLocalPath = req.files.video[0].path
    }

    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "video and thumbnail are required.");

    }

    const videoResponse = await uploadOnCloudinary(videoLocalPath)
    const thumbnailResponse = await uploadOnCloudinary(thumbnailLocalPath)

    const video = await Video.create({
        title,
        description,
        videoFile: videoResponse.url,
        thumbnail: thumbnailResponse.url,
        duration: videoResponse.duration,
        owner: req.user,
        isPublished: isPublish
    })

    return res.status(200).json(new ApiResponse(200, { video }, "Video published successfully."))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || videoId.trim() === "") {
        throw new ApiError(400, "Video id is missing.");
    }

    const video = await Video.findByIdAndUpdate(
        videoId.trim(),
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "Video fetched successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId, title, description } = req.body;

    if (!videoId || videoId.trim() === "") {
        throw new ApiError(400, "Video ID is missing.");
    }

    if (!req.user?._id) {
        throw new ApiError(400, "Unauthorized request.")
    }


    let thumbnailUrl;

    if (req.file) {
        const thumbnailLocalPath = req.file.path;
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        thumbnailUrl = uploadedThumbnail?.url;
    }

    const video = await Video.findOneAndUpdate(
        {
            _id: videoId.trim(),
            owner: req.user._id
        },
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(thumbnailUrl && { thumbnail: thumbnailUrl })
            }
        },
        {
            new: true, runValidators: true
        }
    )
    if (!updateVideo) {
        throw new ApiError(404, "Video not found.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "Video updated successfully."))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId || videoId.trim() === "") {
        throw new ApiError(400, "Video ID is missing.");
    }
    if (!req.user?._id) {
        throw new ApiError(400, "Unauthorized request.")
    }
    const video = await Video.findOneAndDelete({ _id: videoId, owner: req.user._id }, { new: true })

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "Video deleted successfully."))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId || videoId.trim() === "") {
        throw new ApiError(400, "Video ID is missing.");
    }

    if (!req.user?._id) {
        throw new ApiError(400, "Unauthorized request.")
    }

    const video = await Video.findOne(
        {
            _id: videoId.trim(),
            owner: req.user._id
        })
    if (!video) {
        throw new ApiError(404, "Video not found.")
    }

    video.isPublished = !video.isPublished;
    video.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { video }, "Video Published toggled successfully."))
})

export {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
};
