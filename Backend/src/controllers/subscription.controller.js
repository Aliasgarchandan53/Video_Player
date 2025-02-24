import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  //get channel id from params
  //if id exists, create  a subscriber document.
  //get channel-user via channel id
  //subscriber- user, channel- channel via channel id
  //if susccessfully created, send a response that channel is subscribed
  if (!channelId) {
    throw new ApiError(400, "Channel id is requuired.");
  }
  const chId = isValidObjectId(channelId)
    ? new mongoose.Types.ObjectId(channelId)
    : null;
  const channel = await User.findById(chId);
  if (!channel) {
    throw new ApiError(500, "Channel does not exist.");
  }
  if (req.user?.username == channel.username) {
    throw new ApiError(504, "User cannot subscribe to himself");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(501, "Unable to fetch current user");
  }

  const subscription = await Subscription.create({
    subscriber: user,
    channel: channel,
  });
  if (!subscription) {
    throw new ApiError(
      503,
      "Something went wrong while subscribing the channel."
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscription, "Channel was subscribed successfully.")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  //read and check if channel id exist
  //get the channel
  //find subscription docs such that channel is the current fetched channel
  if (!channelId) {
    throw new ApiError(400, "Channel id is requuired.");
  }
  const chId = isValidObjectId(channelId)
    ? new mongoose.Types.ObjectId(channelId)
    : null;
  const channel = await User.findById(chId);
  if (!channel) {
    throw new ApiError(500, "Requested channel does not exist.");
  }
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: channel._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
      },
    },
    {
      $unwind: "$subscribers",
    },
    {
      $project: {
        fullName: "$subscribers.fullName",
        email: "$subscribers.email",
      },
    },
  ]);
  if (!subscribers.length) {
    throw new ApiError(501, " Subscribers cannot be extracted.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully.")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) {
    throw new ApiError(400, "Subscriber id is required.");
  }
  const subId = isValidObjectId(subscriberId)
    ? new mongoose.Types.ObjectId(subscriberId)
    : null;
  const user = await User.findById(subId);
  if (!user) {
    throw new ApiError(500, "User cannot be found.");
  }
  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channels",
      },
    },
    {
      $unwind: "$channels",
    },
    {
      $project: {
        fullName: "$channels.fullName",
        email: "$channels.email",
      },
    },
  ]);

  if (!channels.length > 0) {
    throw new ApiError(501, "No channels have been subscribed.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Subscribed channels have been fetched.")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
