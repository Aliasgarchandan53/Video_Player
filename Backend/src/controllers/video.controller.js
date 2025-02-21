import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    //get video details and validate
    //check if video exists by title
    //upload video on cloudinary 
    //upload thumbnail on cloudinary
    //get owner from db by using id from req.user.?_id
    //creaye a new video resource, if exists,  not upload. 
    //update the db with new user and return the response

    if(!title || !description)
        throw new ApiError(400,"Both video title and description are mandatory.");

    const existingVideo = await Video.findOne({
        title:{
            $eq:title
        }
    })
    if(existingVideo)
        throw new ApiError(500, "Video with same title exists.");

    const videoLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if(!videoLocalPath)
        throw new ApiError(401,"Video is required.");
    if(!thumbnailLocalPath)
        throw new ApiError(402, "Thumbnail is required.");

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const newVideo = await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        videoCloudinaryId:videoFile.public_id,
        thumbnailCloudinaryId:thumbnail.public_id,
        duration:videoFile.duration,
        owner: req.user
    })
    const createdVideo = await Video.findById(newVideo._id).select("-videoCloudinaryId -thumbnailCloudinaryId ");
    if(!createdVideo)
        throw new ApiError(501,"Something went wrong while publishing the video.");
    return res
    .status(200)
    .json(
        new ApiResponse(200, createdVideo, "Video has been published successfully.")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    //if no id, error
    //get video by id, if not found, error
    console.log("Id : ",videoId)
    if(!videoId?.trim())
        throw new ApiError(400,"Video id is required.");
    // checks if video id is valid id..else sends null
    const video = await Video.findOne({
        _id: isValidObjectId(videoId) ? new mongoose.Types.ObjectId(videoId) : null
    });
    if(!video)
        throw new ApiError(500, "Requested video was not found.")
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video has been fetched successfully.")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}