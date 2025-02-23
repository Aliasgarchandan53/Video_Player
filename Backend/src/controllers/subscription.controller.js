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
  if(!channelId){
    throw new ApiError(400,"Channel id is requuired.")
  }
  channelId = isValidObjectId(channelId)? new mongoose.Types.ObjectId(channelId):null;
  const channel = await User.findById(channelId);
  if(!channel){
    throw new ApiError(500,"Channel does not exist.");
  }
  const user = await User.findById(req.user?._id);
  if(!user){
    throw new ApiError(501,"Unable to fetch current user");
  }

  const subscription = await Subscription.create(
    {
      subscriber:user,
      channel:channel
    }
  )
  if(!subscription){
    throw new ApiError(503,"Something went wrong while subscribing the channel".)
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,subscription,"Channel was subscribed successfully.")
  )
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
