const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const session = require('express-session');

router.post('/addCategorias',async(req,res)=>{
    let{id,nome} = req.body;

    Categoria.create({
        id,
        nome
    })
    .then(() =>res.redirect('/categorias/admCategorias'))
    .catch(err =>console.log(err));
});

router.get('/addCategorias',async(req,res)=>{
    if(req.session.login){
        res.render('addCategorias');
    }
    else{
        res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }
});

router.get('/admCategorias',(req,res) => {
    if (req.session.login){
        let search = req.query.job;
        let query = '%'+search+'%';

        if(!search){
            Categoria.findAll({order:[
                ['createdAt','DESC']
            ]})
            .then(categorias => {
    
                res.render('admCategorias',{
                categorias
                });
            })
            .catch(err =>console.log(err));

        } else {
            Categoria.findAll({
                where: {nome: {[Op.like]:query}},
                order:[
                ['createdAt','DESC']
            ]})
            .then(categorias => {
    
                res.render('admCategorias',{
                    categorias, search
                });
            })
            .catch(err =>console.log(err));; 
        }
    }
    else{
        res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }

});

//remover categorias
router.get('/removerCategoria/:id', async (req,res) => {
    const {id}=req.params;
    
    try{
        const categoria = await Categoria.findOne({where:{id:id}});
        if(!categoria){
            return res.status(404).send("Nenhuma Categoria Encontrada para remover");
        }
        await categoria.destroy();
        res.redirect('/categorias/admCategorias');
    }
    catch(err){
        console.log(err);
        res.status(500).send("Ocorreu um erro ao excluir a categoria");
    }
});

//editar categoria
router.get('/editCategoria/:id', async (req,res) => {
        if(req.session.login){
            const categorias = await Categoria.findOne({where: {id:req.params.id}});
    
             res.render('editCategoria', { 
            categoria: categorias.toJSON()   // ← converte p/ plain object
            });
        }
        else
        {
            res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
        }
});

router.post('/editCategoria',(req, res) =>{
    const {id} = req.body;
    const{nome} = req.body;

    Categoria.findOne({where: {id:id}})
    .then(categoria =>{
        if(!categoria){
            console.log("Nenhuma categoria encontrada!");
        } else {
            categoria.update({nome})
            .then(() => res.redirect('/categorias/admCategorias'))
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});


module.exports = router