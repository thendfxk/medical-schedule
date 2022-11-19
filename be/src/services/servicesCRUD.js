import db, { sequelize } from '../models/index'
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10);



let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashpassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            })
            resolve('okk create a new user suseed! ')
        } catch (e) {
            reject(e);
        }
    })
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

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error)
        }
    })
}

let getUserInfoById = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: idUser },
                raw: true

            })

            if (user) {
                resolve(user);
            }
            else {
                resolve([]);
            }
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let user = db.User.findOne({
            //     where: { id: data.id },
            //     raw: false
            // })
            // if (user) {
            //     user.firstName = data.firstName;
            //     user.lastName = data.lastName;
            //     user.address = data.address;


            //     resolve();
            // } else {
            //     resolve();
            // }
            await db.User.update(
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                },
                {
                    where: { id: data.id },
                }
            );
            let allUser = await db.User.findAll();
            resolve(allUser);

        } catch (error) {
            console.log(error);
        }
    })
    console.log('DONE ');
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserById: updateUserById,
}