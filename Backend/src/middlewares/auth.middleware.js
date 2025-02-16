import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// _ : when 'res' is not used , it is replaced by '_'
export const verifyJWT = asyncHandler(async (req , _,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401,"Unauthorized request.");
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET); //might have to await, check in testing

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401,"Invalid access token.");
        }
        //added the currently active user to request so that id can be used to logout.
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token.");
    }
})