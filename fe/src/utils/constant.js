import { handleGetPermission } from "../services/userService";
export const path = {
    HOME: '/',
    HOMEPAGE: '/home',
    LOGIN: '/login',
    REGISTER: '/register',
    LOG_OUT: '/logout',
    SYSTEM: '/system',
    DETAIL_DOCTOR: '/detail-doctor/:id',
    VERIFY_EMAIL_BOOKING: '/verify-booking',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
};

export const LANGUAGES = {
    VI: 'vi',
    EN: 'en'
};

export const CRUD_ACTION = {
    CREATE: "CREATE",
    EDIT: "EDIT",
    DELETE: "DELETE",
    READ: "READ",
};

export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N'
}
export const USER_ROLE = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    GUEST: 'guest'
}
export let checkPermission = async (token) => {
    let per = await handleGetPermission(token);
    if (per && per.errCode === 0) {
        return per.role;
    } else {
        return 'guest';
    }

}