import express, { application } from "express";
import homeController from "../controllers/homeControllers"
import userController from "../controllers/userControllers"
import doctorController from '../controllers/doctorControllers'
import patientController from '../controllers/patientController'
import authJwt from "../midlleware/authJwt";
let router = express.Router();

let initWebRoute = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.get("/hoidanit", (req, res) => {
        return res.send("HOI DAN IT")
    });

    //check permission
    router.post("/api/check-permission", authJwt.verifyToken, userController.checkPermission);

    //rest api
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displaygetCRUD);
    router.get("/edit-crud", homeController.geteditCRUD);
    router.post("/put-crud", homeController.puteditCRUD);

    router.post("/api/login", userController.handleLogin);
    router.post("/api/register", userController.handleRegister);
    router.post('/api/forgot-password', userController.handleForgotPassword);
    router.post('/api/get-info-reset-password-by-token', userController.handleInfoResetPasswordByToken);
    router.post('/api/reset-password', userController.handleResetPassword);

    //api with react
    router.get("/api/get-all-users", userController.handleLGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/allcode", userController.getAllCode);


    router.get("/api/get-top-doctor-home", doctorController.handleGetTopDoctor);
    router.get("/api/get-all-doctors", doctorController.handleGetAllDoctors);
    router.post("/api/save-info-doctors", doctorController.postInfoDoctor);
    router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)


    //doctor schedule
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.get("/api/get-schedule-by-date", doctorController.getScheduleByDate);


    router.post('/api/patient-booking-appointment', patientController.postBookingAppointment)
    router.post('/api/verify-booking', patientController.postVerifyBooking);


    return app.use("/", router);
}

module.exports = initWebRoute;