import userService from "../services/userServices"
//check email exist
//compare password
//return user info
//access_token: JWT json web token

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter',
        });
    }
    let userData = await userService.handleLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
}

let handleLGetAllUsers = async (req, res) => {
    let id = req.query.type; //ALL //id
    console.log("User id " + id);
    let users = await userService.getAllUsers(id);
    console.log(users);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users
    })
}


let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    console.log(message)
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: "missing required parameter "
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserById(data);
    return res.status(200).json(message)
}
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log('get all code err: ', error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server',
        });
    }
}
let handleRegister = async (req, res) => {
    try {
        let userData = await userService.handleRegister(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
let checkPermission = async (req, res) => {
    try {
        let permission = await userService.checkPermission(req.body);
        return res.status(200).json(permission);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
let handleForgotPassword = async (req, res) => {
    try {
        let userData = await userService.handleForgotPassword(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
let handleInfoResetPasswordByToken = async (req, res) => {
    try {
        let userData = await userService.handleInfoResetPasswordByToken(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }

}
let handleResetPassword = async (req, res) => {
    try {
        let userData = await userService.handleResetPassword(req.body);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleLGetAllUsers: handleLGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleRegister: handleRegister,
    checkPermission: checkPermission,
    handleForgotPassword: handleForgotPassword,
    handleInfoResetPasswordByToken: handleInfoResetPasswordByToken,
    handleResetPassword: handleResetPassword
}