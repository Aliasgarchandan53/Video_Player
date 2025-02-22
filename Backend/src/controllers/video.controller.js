import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const pipeline = [];
  const matchStage = {};
  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } }, // Case-insensitive title search
      { description: { $regex: query, $options: "i" } }, // Case-insensitive description search
    ];
  }
  if (userId) {
    matchStage.userId = userId; // Filter by user ID if provided
  }
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }
  // Sorting stage
  const sortStage = {};
  sortStage[sortBy] = sortType === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  // Pagination stages
  pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });

  // Fetch total count for pagination
  const totalVideosPipeline = [
    { $match: matchStage },
    { $count: "totalVideos" },
  ];

  // Execute aggregation
  const [videos, totalCountResult] = await Promise.all([
    Video.aggregate(pipeline),
    Video.aggregate(totalVideosPipeline),
  ]);
  const totalVideos =
    totalCountResult.length > 0 ? totalCountResult[0].totalVideos : 0;
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        totalVideos,
        currentPage: pageNum,
        totalPages: Math.ceil(totalVideos / limitNum),
      },
      "Videos fetched successfully."
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //get video details and validate
  //check if video exists by title
  //upload video on cloudinary
  //upload thumbnail on cloudinary
  //get owner from db by using id from req.user.?_id
  //creaye a new video resource, if exists,  not upload.
  //update the db with new user and return the response

  if (!title || !description)
    throw new ApiError(400, "Both video title and description are mandatory.");

  const existingVideo = await Video.findOne({
    title: {
      $eq: title,
    },
  });
  if (existingVideo) throw new ApiError(500, "Video with same title exists.");

  const videoLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!videoLocalPath) throw new ApiError(401, "Video is required.");
  if (!thumbnailLocalPath) throw new ApiError(402, "Thumbnail is required.");

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(501, "Unable to fetch owner of the video.");
  const newVideo = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    videoCloudinaryId: videoFile.public_id,
    thumbnailCloudinaryId: thumbnail.public_id,
    duration: videoFile.duration,
    owner: user,
  });
  const createdVideo = await Video.findById(newVideo._id).select(
    "-videoCloudinaryId -thumbnailCloudinaryId "
  );
  if (!createdVideo)
    throw new ApiError(501, "Something went wrong while publishing the video.");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createdVideo,
        "Video has been published successfully."
      )
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  //if no id, error
  //get video by id, if not found, error
  if (!videoId?.trim()) throw new ApiError(400, "Video id is required.");
  // checks if video id is valid id..else sends null
  const video = await Video.findOne({
    _id: isValidObjectId(videoId) ? new mongoose.Types.ObjectId(videoId) : null,
  });
  if (!video) throw new ApiError(500, "Requested video was not found.");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video has been fetched successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId?.trim())
    throw new ApiError(400, "Video id is required for deletion.");
  const vid_id = isValidObjectId(videoId)
    ? new mongoose.Types.ObjectId(videoId)
    : null;

  const video = await Video.findById(vid_id);
  if (!video) throw new ApiError(500, "Error fetching requested video.");

  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  )
    thumbnailLocalPath = req.files?.thumbnail[0].path;
  let updatedThumbnail;
  if (thumbnailLocalPath) {
    updatedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    await deleteFromCloudinary(video.thumbnailCloudinaryId);
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    vid_id,
    {
      $set: {
        title: title ? title : video.title,
        description: description ? description : video.description,
        thumbnail: updatedThumbnail ? updatedThumbnail.url : video.thumbnail,
        thumbnailCloudinaryId: updatedThumbnail
          ? updatedThumbnail.public_id
          : video.thumbnailCloudinaryId,
      },
    },
    { new: true }
  ).select("-videoCloudinaryId -thumbnailCloudinaryId");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video details updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //find video by id and get public id
  //if does not exist, error
  //if exists, delete from cloudinary
  //successfull, delete from db
  //successfull, return resp

  if (!videoId?.trim())
    throw new ApiError(400, "Video id is required for deletion.");
  const vid_id = isValidObjectId(videoId)
    ? new mongoose.Types.ObjectId(videoId)
    : null;
  const video = await Video.findOne({
    _id: vid_id,
  });
  if (!video)
    throw new ApiError(500, "Requested video for deletion does not exist.");

  const respVid = await deleteFromCloudinary(video?.videoCloudinaryId);

  if (!respVid) throw new ApiError(501, "Error deleting video from cloudinary");
  const respThumb = await deleteFromCloudinary(video?.thumbnailCloudinaryId);
  if (!respThumb)
    throw new ApiError(501, "Error deleting video thumbnail from cloudinary");
  const deletedVideo = await Video.deleteOne({
    _id: vid_id,
  });
  if (!deletedVideo)
    throw new ApiError(502, "Error deleting video from database.");

  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId?.trim())
    throw new ApiError(
      400,
      "Video id is required for changing publish status."
    );
  const vid_id = isValidObjectId(videoId)
    ? new mongoose.Types.ObjectId(videoId)
    : null;
  const video = await Video.findByIdAndUpdate(
    vid_id,
    [{ $set: { isPublished: { $not: "$isPublished" } } }], //aggregation pipeline update syntax
    { new: true }
  );
  if (!video) throw new ApiError(500, "Failed to toggle publish status.");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status toggled successfully."));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
