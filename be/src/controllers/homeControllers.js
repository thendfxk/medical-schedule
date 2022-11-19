import db from '../models/index'
import servicesCRUD from '../services/servicesCRUD'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homepage.ejs', {
        });

    } catch (e) {
        console.log(e)
    }
}

let getAboutPage = (req, res) => {
    return res.render('about.ejs');
}


let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async (req, res) => {

    let message = await servicesCRUD.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
}

let displaygetCRUD = async (req, res) => {
    let users = await servicesCRUD.getAllUser();
    console.log('----------------');
    console.log(users);
    return res.render('displaygetCRUD.ejs', {
        dataUsers: users
    });
}
let geteditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log('userID ' + userId);
    if (userId) {
        let userData = await servicesCRUD.getUserInfoById(userId);
        console.log('-----------------');
        console.log(userData);
        return res.render('editCRUD.ejs', {
            dataUser: userData,
        });
    }
    else {
        return res.send('abc');

    }
}

let puteditCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await servicesCRUD.updateUserById(data);
    return res.send('UPDATE SUSSESS');
}

// object: {
//     key: '',
//     value: ''
// }

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displaygetCRUD: displaygetCRUD,
    geteditCRUD: geteditCRUD,
    puteditCRUD: puteditCRUD,
}