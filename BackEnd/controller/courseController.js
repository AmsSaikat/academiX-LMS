import Course from "../model/courseModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"

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
        const courses=await Course.find({isPublished:true})

        if(!courses){
            return res.status(400).json({message:"Courses not found(published yet)"})
        }
    } catch (error) {
        return res.status(500).json({message:`getPublishedCourses error ${error}`})
    }
}



export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all courses created by this user
    const courses = await Course.find({ creator: userId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this creator" });
    }

    // Success: return the courses
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
        const course=await Course.findById(courseId)

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