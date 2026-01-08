import express from 'express'
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getCreatorById, getLectureById, getPublishedCourses, removeCourse, removeLecture, getAdminCourseAnalytics, enrollCourse } from '../controller/courseController.js'
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"

const courseRouter= express.Router()

courseRouter.post("/create",isAuth,createCourse)
courseRouter.get("/getPublished",getPublishedCourses)
courseRouter.get("/getcreator",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",upload.single("thumbnail"), isAuth, editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/remove/:courseId",isAuth,removeCourse) 
courseRouter.post("/creator",isAuth, getCreatorById)


//For lectures

courseRouter.post('/createlecture/:courseId',isAuth,createLecture)
courseRouter.get('/getcourselecture/:courseId',isAuth,getCourseLecture)
courseRouter.get("/getlecture/:lectureId", isAuth, getLectureById);
courseRouter.post('/editlecture/:lectureId', isAuth, upload.single("videoUrl"), editLecture)
courseRouter.delete('/removelecture/:lectureId',isAuth,removeLecture)
courseRouter.get("/admin/analytics",isAuth,getAdminCourseAnalytics);


//For enrolls
courseRouter.post("/enroll/:courseId", isAuth, enrollCourse);

export default courseRouter