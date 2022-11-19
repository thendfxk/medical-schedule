import doctorServices from '../services/doctorServices'
let handleGetTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let doctors = await doctorServices.getTopDoctorHome(+limit);
        return res.status(200).json(doctors);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: "Err From Server"
        })
    }
}
let handleGetAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorServices.getAllDoctors(req.query.token);
        return res.status(200).json(doctors)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorServices.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(200).json({
            errCode: -2,
            errMessage: 'err from server'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorServices.getDoctorById(req.query.id);
        return res.status(200).json(info)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorServices.bulkCreateSchedule(req.body);
        return res.status(200).json(info)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })

    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorServices.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(info)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorServices.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorServices.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleGetTopDoctor: handleGetTopDoctor,
    handleGetAllDoctors: handleGetAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById
}