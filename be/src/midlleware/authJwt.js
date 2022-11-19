import db from "../models/index"
import _ from 'lodash';
const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
    try {
        let token = req.body.token;
        console.log('token', token, typeof (token))
        if (!token) {
            return res.status(200).json({
                errCode: 2,
                role: 'guest'
            });
        }
        jwt.verify(token, process.env.JSON_SECRET, (err, decoded) => {
            if (err) {
                return res.status(200).json({
                    errCode: 3,
                    role: 'guest'
                });
            }
            req.body.authId = decoded.id;
            req.body.authRole = decoded.roleId;
            next();
        });

    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })

    }
};
// let isAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRoles().then((roles) => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].roleName === "administrator") {
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({
//                 message: "Require Admin Role!",
//             });
//             return;
//         });
//     });
// };
// let isModerator = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRoles().then((roles) => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].roleName === "moderator") {
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({
//                 message: "Require Moderator Role!",
//             });
//         });
//     });
// };
// let isModeratorOrAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then((user) => {
//         user.getRoles().then((roles) => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].roleName === "moderator") {
//                     next();
//                     return;
//                 }
//                 if (roles[i].roleName === "admin") {
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({
//                 message: "Require Moderator or Admin Role!",
//             });
//         });
//     });
// };
module.exports = {
    verifyToken: verifyToken,
}
