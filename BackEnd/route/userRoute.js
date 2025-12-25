import express from "express"
import upload from "../middleware/multer.js"
import { updateProfile } from "../controller/userController.js"
import { getCurrentUser } from "../controller/userController.js"
import isAuth from "../middleware/isAuth.js"

const userRoute = express.Router()

userRoute.get("/getcurrentuser", isAuth, getCurrentUser)

userRoute.post(
  "/profile",
  isAuth,
  upload.single("photoUrl"),
  updateProfile
)

export default userRoute
