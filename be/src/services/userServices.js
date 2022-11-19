import db from "../models/index"
import bcrypt, { hash } from 'bcryptjs'
require('dotenv').config();
import sendEmailSimple from './emailServices'

const jwt = require("jsonwebtoken");

var salt = bcrypt.genSaltSync(10);

let buildUrlForgotEmail = (token) => {
    let result = `${process.env.URL_REACT}/reset-password?token=${token}`
    return result
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpassword = await bcrypt.hashSync(password, salt);
            resolve(hashpassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id'],
                    where: {
                        email: email,
                    },
                    raw: true,
                })
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        let token = jwt.sign({ id: user.id, roleId: user.roleId }, process.env.JSON_SECRET);
                        user.accessToken = token;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'password wrong ';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'user notfound ';
                }
                resolve(userData)
            } else {
                //return err
                userData.errCode = 1;
                userData.errMessage = "your's email isn't exist. Plz try other email";
                resolve(userData)
            }

        } catch (error) {
            reject(error)
        }
    })
}
let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: email
                }
            })

            if (!user) {
                resolve(false)
            }
            else {
                resolve(true)
            }
        } catch (error) {
            reject(error)
        }
    })
}
let compareUserPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        try {

        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }

                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error)
        }
    })

}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used. P;z check lai ho minh nha"
                })
            }
            else {
                let hashpassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashpassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let Founduser = await db.User.findOne({
            where: { id: userId }
        })
        if (!Founduser) {
            resolve({
                errCode: 2,
                errMessage: "NO FOUND"
            })
        }
        // await Founduser.destroy();
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            message: "The user is delete "
        })
    })
}

let updateUserById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImg = '';
            let user = db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (!data.id || !data.positionId || !data.roleId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter"
                })
            }
            if (data.avatar) {
                dataImg = data.avatar
            }
            if (user) {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        roleId: data.roleId,
                        phonenumber: data.phoneNumber,
                        gender: data.gender,
                        positionId: data.positionId,
                        image: dataImg,
                    },
                    {
                        where: { id: data.id },
                    }
                );
                resolve({
                    errCode: 0,
                    message: "Update success"
                });
            }
            else {
                resolve({
                    errCode: 1,
                    message: 'User notfound'
                })
            }


        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing  parameter'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;

                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    })
}
let handleRegister = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used. Plz check lai ho minh nha"
                })
            }
            else {
                let hashpassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashpassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    roleId: 'R3',
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let checkPermission = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('data', data.authRole)
            if (data.authRole === 'R1') {
                resolve({
                    errCode: 0,
                    role: 'admin'
                })
            } else if (data.authRole === 'R2') {
                resolve({
                    errCode: 0,
                    role: 'doctor'
                })
            } else if (data.authRole === 'R3') {
                resolve({
                    errCode: 0,
                    role: 'patient'
                })
            } else {
                resolve({
                    errCode: 0,
                    role: 'guest'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('parram', data)
            if (!data.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email
                    },
                });
                if (user) {
                    let token = jwt.sign({ email: data.email }, process.env.JSON_SECRET);
                    await sendEmailSimple.sendEmailChangePassword({
                        receiverMail: data.email,
                        confirmlink: buildUrlForgotEmail(token)
                    })

                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email không có trong hệ thống! vui lòng kiểm tra lại'
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    // data: data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
let handleInfoResetPasswordByToken = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = data.token;
            if (!data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            else {
                jwt.verify(token, process.env.JSON_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(200).json({
                            errCode: 2,
                            errMessage: 'Token not found'
                        });
                    }
                    data.email = decoded.email;
                })
                let user = await db.User.findOne({
                    attributes: ['email', 'firstName', 'lastName'],
                    where: {
                        email: data.email
                    },
                    raw: true,

                });
                if (user) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                        data: user
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email không có trong hệ thống! vui lòng kiểm tra lại'
                    })
                }
            }
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}
let handleResetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImg = '';

            if (!data.password || !data.email) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter"
                })
            }
            let user = db.User.findOne({
                where: { email: data.email },
                raw: false
            })
            if (user) {
                let hashpassword = await hashUserPassword(data.password);
                await db.User.update(
                    {
                        password: hashpassword
                    },
                    {
                        where: { email: data.email },
                    }
                );
                resolve({
                    errCode: 0,
                    message: "Update success"
                });
            }
            else {
                resolve({
                    errCode: 1,
                    message: 'User not found'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleLogin: handleLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserById: updateUserById,
    getAllCodeService: getAllCodeService,
    handleRegister: handleRegister,
    checkPermission: checkPermission,
    handleForgotPassword: handleForgotPassword,
    handleInfoResetPasswordByToken: handleInfoResetPasswordByToken,
    handleResetPassword: handleResetPassword
}