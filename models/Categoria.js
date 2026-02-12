const Sequelize = require('sequelize');
const db = require('../db/connection');
const sequelize = require('../db/connection');
const Noticia =require('./Noticia');

const Categoria = db.define('categorias',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

//Categoria.hasMany(Noticia,{foreignKey:'idCategoria'});

module.exports = Categoria