const Sequelize = require('sequelize');
const db = require("../db/connection");
const sequelize = require('../db/connection');

const Usuario = db.define('usuarios',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    nome:{
        type:Sequelize.STRING,
    },
    email:{
        type: Sequelize.STRING,
    },
    login:{
        type:Sequelize.STRING,
    },
    senha:{
        type: Sequelize.STRING
    },
    ativo:{
        type:Sequelize.TINYINT,
        defaultValue:0

    }
});

module.exports = Usuario

