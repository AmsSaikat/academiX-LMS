import Course from "../model/courseModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import Lecture from "../model/lectureModel.js"
import User from "../model/userModel.js"

export const createCourse= async (req,res)=>{
    try {
        const {title,category}=req.body
        if(!title || !category){
            return res.status(400).json({message:"Both title & category is required"})
        }
        const course= await Course.create({
            title,category,
            creator:req.userId
        })

        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({message:`CreateCourse error ${error}`})
    }
}



export const getPublishedCourses=async(req,res)=>{
    try {
        const courses=await Course.find({isPublished:true}).populate("lectures")

        if(!courses){
            return res.status(400).json({message:"Courses not found(published yet)"})
        }

         return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({message:`getPublishedCourses error ${error}`})
    }
}



export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;

    // Populate lectures so videoUrl is available
    const courses = await Course.find({ creator: userId }).populate("lectures");

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this creator" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: `getCreatorCourses error: ${error.message}` });
  }
};




export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subtitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    console.log("FILE:", req.file);
console.log("BODY:", req.body);


    // Find existing course
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Upload new thumbnail if provided, otherwise keep existing
    let thumbnailUrl = course.thumbnail;
    if (req.file) {
      thumbnailUrl = await uploadOnCloudinary(req.file.path);
    }


    // Build update object dynamically to avoid overwriting with undefined
    const updateData = {
      ...(title && { title }),
      ...(subtitle && { subtitle }),
      ...(description && { description }),
      ...(category && { category }),
      ...(level && { level }),
      ...(typeof isPublished !== "undefined" && { isPublished }),
      ...(price && { price }),
      thumbnail: thumbnailUrl,
    };

    // Update course
    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    console.log("Uploaded thumbnail:", thumbnailUrl);

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: `editCourse error: ${error.message}` });
  }
};






export const getCourseById=async(req,res)=>{
    try {
        const {courseId}=req.params
        const course = await Course.findById(courseId).populate("lectures")


        if(!course){
            return res.status(500).json({message:"Unable to find the course"})
        }

         return res.status(200).json(course)

    } catch (error) {
         return res.status(500).json({message:`getCourseById error ${error}`})
    }
}



export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ message: "Course removed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "removeCourse error", error: error.message });
  }
};



export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || lectureTitle.trim() === "") {
      return res.status(400).json({ message: "Lecture title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create lecture
    const lecture = await Lecture.create({ lectureTitle });

    // Push lecture into course
    course.lectures.push(lecture._id);
    await course.save();

    // Optionally populate lectures if you want to return them
    await course.populate("lectures");

    return res.status(201).json({ lecture, lectures: course.lectures });
  } catch (error) {
    console.error("createLecture error:", error);
    return res.status(500).json({ message: "createLecture error", error: error.message });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ lectures: course.lectures });
  } catch (error) {
    console.error("getCourseLecture error:", error);
    return res.status(500).json({ message: "getCourseLecture error", error: error.message });
  }
};



export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    return res.status(200).json({ lecture });
  } catch (error) {
    console.error("getLectureById error:", error);
    return res.status(500).json({ message: "getLectureById error", error: error.message });
  }
};


export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (req.file) {
      const videoUrl = await uploadOnCloudinary(req.file.path);
      lecture.videoUrl = videoUrl;
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (typeof isPreviewFree !== "undefined") {
      lecture.isPreviewFree = isPreviewFree === "true" || isPreviewFree === true;
    }

    await lecture.save();
    return res.status(200).json({ lecture });
  } catch (error) {
    console.error("editLecture error:", error);
    return res.status(500).json({ message: "editLecture error", error: error.message });
  }
};




export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({ message: "Invalid lecture ID" });
    }

    // Delete the lecture document
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Remove reference from any course that contains this lecture
    await Course.updateMany(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({ message: "Lecture removed successfully" });
  } catch (error) {
    console.error("removeLecture error:", error);
    return res.status(500).json({ message: "removeLecture error", error: error.message });
  }
};



export const getCreatorById=async (req,res)=>{
  try {
    const {userId}=req.body
    const user=await User.findById(userId).select("-password")

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    return res.status(200).json(user)
  } catch (error) {
      console.error("getCreatorById error:", error);
      return res.status(500).json({ message: "getCreatorById error", error: error.message });
  }
}





// Enroll a student in a course (no payment)

export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userId; // from isAuth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Already enrolled?
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    res.status(200).json({ success: true, message: "Enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Enrollment failed" });
  }
};






export const getAdminCourseAnalytics = async (req, res) => {
  try {
    const creatorId = req.userId; // from isAuth middleware

    const courses = await Course.find({ creator: creatorId })
      .select("title lectures enrolledStudents");

    const analytics = courses.map(course => ({
      courseId: course._id,
      title: course.title,
      lectureCount: course.lectures.length,
      enrolledCount: course.enrolledStudents.length
    }));

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Admin analytics error:", error);
    return res.status(500).json({
      message: "Failed to load course analytics",
      error: error.message
    });
  }
};
