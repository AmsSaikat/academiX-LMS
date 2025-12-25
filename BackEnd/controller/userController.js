import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"

// ---------------------- GET-CURRENT-USER ----------------------
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json({user:user})
  } catch (error) {
    return res.status(500).json({ message: `GetCurrentUser error: ${error.message}` })
  }
}

// ---------------------- UPDATE-PROFILE ----------------------
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { description, name } = req.body;

    let photoUrl;
    if (req.file) {
      // uploadOnCloudinary returns the secure_url string
      photoUrl = await uploadOnCloudinary(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        description,
        ...(photoUrl && { photoUrl }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Update Profile error", error: error.message });
  }
};