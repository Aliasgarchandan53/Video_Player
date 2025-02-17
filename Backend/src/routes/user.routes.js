import {  Router } from "express"
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar", //keep same name in frontend
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post( verifyJWT ,logoutUser)
router.route("/refreshToken").post( refreshAccessToken)//verifyJwt is not exactly required
router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)
router.route("/updateAccountDetails").post(verifyJWT,updateAccountDetails)
router.route("/updateAvatar").post(
    upload.single("avatar"),
    updateUserAvatar
)
router.route("/updateCoverImage").post(
    upload.single("coverImage"),
    updateUserCoverImage
)
export default router