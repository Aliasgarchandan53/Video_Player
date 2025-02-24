import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = new Router()

router.use(verifyJWT)

router.route("/:channelId")
    .post(toggleSubscription)
    .get(getUserChannelSubscribers)

router.route("/:subscriberId").put(getSubscribedChannels)//doubt: why put worked?

export default router;