const { Sequelize, Model } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
//db
const sequelize = new Sequelize('baophuctest', 'root', null, {
  host: '',
  dialect: 'mysql',
});


let connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDb;