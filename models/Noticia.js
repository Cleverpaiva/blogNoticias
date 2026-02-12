const Sequelize = require('sequelize');
const db = require('../db/connection');
const sequelize = require('../db/connection');
const Comentario = require('./Comentario');
const Categoria = require('./Categoria');
 

const Noticia = db.define('noticias',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    idCategoria:{
        type:Sequelize.INTEGER,
    },
    titulo:{
        type:Sequelize.STRING,
    },
    subti:{
        type:Sequelize.STRING,
    },
    texto:{
        type:Sequelize.TEXT,
    },
    nomeAutor:{
        type: Sequelize.STRING,
    },
    cidAutor:{
        type: Sequelize.STRING,
    },
    fotos:{
        type: Sequelize.STRING,
    },
    ver:{
        type:Sequelize.CHAR,
        defaultValue:'s'
    }
});

Noticia.hasMany(Comentario, {foreignKey: 'idNot'});

module.exports = Noticia