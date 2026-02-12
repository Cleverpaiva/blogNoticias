const Sequelize = require('sequelize');
const db = require('../db/connection');
const sequelize = require('../db/connection'); 
const Noticia = require('./Noticia');



const Comentario =db.define('comentarios',{
    idComent:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    idNot:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
            model:Noticia,
            key:'id'
        }
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    conteudo:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    aprovado:{
        type:Sequelize.TINYINT,
        defaultValue:1
    }

});

//Comentario.belongsTo(Noticia, { foreignKey: 'id'});

module.exports = Comentario
