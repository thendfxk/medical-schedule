import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUsers, deleteUserbyId, editUser, getTopDoctors, getAllDoctors, saveDetailDoctor } from '../../services/userService';
import { toast } from "react-toastify"

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START,

            })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            }
            else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log(error)
        }
    }

    // type: actionTypes.FETCH_GENDER_START
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            }
            else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log(error)
        }
    }

}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            }
            else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log(error)
        }
    }
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            console.log('check create user redux ', res)
            if (res && res.errCode === 0) {
                toast.success("Create a new user success");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            }
            else {
                dispatch(saveUserFailed());
            }
        } catch (error) {
            dispatch(saveUserFailed());
            console.log(error)
        }
    }
}
export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})
export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users));
            }
            else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (error) {
            dispatch(fetchAllUsersFailed());
            console.log(error)
        }
    }
}
export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
})
export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})
export const deleteUser = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserbyId(id);
            if (res && res.errCode === 0) {
                toast.success("delete Success success");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            }
            else {
                toast.error("delete err");
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            toast.error("delete err");
            dispatch(deleteUserFailed());
            console.log(error)
        }
    }
}
export const deleteUserSuccess = (data) => ({
    type: actionTypes.DELETE_USER_SUCCESS,
    users: data,
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const editNewUser = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUser(user);
            if (res && res.errCode === 0) {
                toast.success("edit Success success");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            }
            else {
                toast.error("edit err");
                dispatch(editUserFailed());
            }
        } catch (error) {
            toast.error("edit err");
            dispatch(editUserFailed());
            console.log(error)
        }
    }
}
export const editUserSuccess = (data) => ({
    type: actionTypes.EDIT_USER_SUCCESS,
    users: data,
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const fetchTopDoctor = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctors('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctors: res.data,
                })
            }
            else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
                });
            }
        } catch (e) {
            console.log("fetchTopDoctorHomeService", e);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            })
        }
    }
}

export const fetchAllDoctors = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors(user.accessToken);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDrs: res.data,
                })
            }
            else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                });
            }
        } catch (e) {
            console.log("fetchTopDoctorHomeService", e);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            })
        }
    }
}

export const savedetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctor(data);
            if (res && res.errCode === 0) {
                toast.success("save infor detail succeed")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            }
            else {
                toast.error("save infor detail err")

                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                });
            }
        } catch (e) {
            toast.error("save infor detail err")

            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            })
        }
    }
}

export const fetchAllScheduleHours = (user) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data,
                })
            }
            else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            })
        }
    }
}
export const getAllRequiredInfor = () => {
    return async (dispatch, getState) => {
        try {
            let res_price = await getAllCodeService("PRICE");
            let res_payment = await getAllCodeService("PAYMENT");
            let res_province = await getAllCodeService("PROVINCE");

            if ((res_price && res_price.errCode === 0)
                && (res_payment && res_payment.errCode === 0)
                && (res_province && res_province.errCode === 0)) {
                let data = {
                    resPrice: res_price.data,
                    resPayment: res_payment.data,
                    resProvince: res_province.data
                }
                dispatch(fetchAllRequiredInforSuccess(data))
            }
            else {
                dispatch(fetchAllRequiredInforFailed());
            }
        } catch (e) {
            dispatch(fetchAllRequiredInforFailed());
            console.log("Error", e);
        }
    }
}
export const fetchAllRequiredInforSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_REQUIRED_INFOR_SUCCESS,
    data: data,
})

export const fetchAllRequiredInforFailed = () => ({
    type: actionTypes.FETCH_ALL_REQUIRED_INFOR_FAILED,
})

//start doing end