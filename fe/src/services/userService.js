import axios from "../axios";

const handleGetPermission = async (token) => {
    return await axios.post('/api/check-permission', token)
}
const handleLoginApi = async (email, password) => {
    return await axios.post('/api/login', { email, password })
}
const handleRegisterApi = async (data) => {
    return await axios.post('/api/register', data)
}
const handleForgotPassWord = async (data) => {
    return await axios.post('/api/forgot-password', data)
}
const checkTokenResetPassword = async (data) => {
    return await axios.post('/api/get-info-reset-password-by-token', data)
}
const handleResetPassWord = async (data) => {
    return await axios.post('/api/reset-password', data)
}
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?type=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('BAOPHUC CREATE USER ', data);
    return axios.post('/api/create-new-user', data);
}

const deleteUserbyId = (id) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: id,
        }
    });
}

const editUser = (inputdata) => {
    return axios.put('/api/edit-user', inputdata);
}

const getAllCodeService = (inputdata) => {
    return axios.get(`/allcode?type=${inputdata}`)
}
const getTopDoctors = (limit) => {
    return axios.get(`/api/get-top-doctor-home?limit=${limit}`)
}
const getAllDoctors = (token) => {
    return axios.get(`/api/get-all-doctors?token=${token}`)
}
const saveDetailDoctor = (data) => {
    return axios.post('/api/save-info-doctors', data);
}
const getDetailDoctorInfo = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
}
const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}
const getScheduleByDate = (doctorId, date) => {
    return axios.get(`api/get-schedule-by-date?doctorId=${doctorId}&date=${date}`)
}
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const postPatientAppointment = (data) => {
    return axios.post(`/api/patient-booking-appointment`, data)
}
const postVerifyBooking = (data) => {
    return axios.post(`/api/verify-booking`, data)
}

export {
    handleLoginApi, getAllUsers, createNewUserService, deleteUserbyId,
    editUser, getAllCodeService, getTopDoctors, getAllDoctors, saveDetailDoctor,
    getDetailDoctorInfo, saveBulkScheduleDoctor, getScheduleByDate, getExtraInforDoctorById,
    getProfileDoctorById, postPatientAppointment, postVerifyBooking, handleRegisterApi
    , handleGetPermission, handleForgotPassWord, checkTokenResetPassword, handleResetPassWord
}


