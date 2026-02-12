const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const session = require('express-session');

router.post('/cadUser', async (req,res) => {
    
        let { id, nome, email, login,ativo } = req.body;
        let passwd = req.body.senha.toString();
    
         try {
            const salt = await bcrypt.genSalt(10);          // gera o salt
            const senhaHash = await bcrypt.hash(passwd, salt); // gera o hash

            await Usuario.create({
                id,
                nome,
                email,
                login,
                senha: senhaHash,
                ativo                           // salva o hash no BD
            });

            res.redirect('/adm');
            } catch(err) {
            console.log(err);
            res.send("Erro ao cadastrar usuário");
        }
    
});




router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/cadUsuarios',(req,res) => {
    if(req.session.login){
        res.render('cadUsuarios');
    }
    else{
        res.send('<h1> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }
});

router.post('/valida', async (req,res)=> {

    let nick = req.body.login;
    let senha = req.body.senha.toString();
    

    try {

        // Busca o usuário pelo login
        const user = await Usuario.findOne({
            where: { login: nick }
        });

        // Se não encontrou o login → volta para login
        if(!user) {
            return res.redirect('/login');
        }

        // Compara senha digitada com hash salvo
        const senhaOk = await bcrypt.compare(senha, user.senha);
        
        if(senhaOk && user.ativo == 1) {
            req.session.login=nick
            return res.redirect('/adm');
            console.log("Você está logado como: "+req.session.login);
        } else {
            return res.redirect('/login');
        }

    } catch(err) {
        console.log(err);
        res.send("Erro ao realizar login");
    }

});

//administração dos usuários
router.get('/admUsuarios',(req,res) => {
    if (req.session.login){
        let search = req.query.job;
        let query = '%'+search+'%';

        if(!search){
            Usuario.findAll({order:[
                ['createdAt','DESC']
            ]})
            .then(usuarios => {
    
                res.render('admUsuarios',{
                usuarios
                });
            })
            .catch(err =>console.log(err));

        } else {
            Usuario.findAll({
                where: {nome: {[Op.like]:query}},
                order:[
                ['createdAt','DESC']
            ]})
            .then(usuarios => {
    
                res.render('admUsuarios',{
                    usuarios, search
                });
            })
            .catch(err =>console.log(err));; 
        }
    }
    else{
        res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }

});

//editar usuarios
router.get('/editUsuario/:id', async (req,res) => {
        if(req.session.login){
            const usuarios = await Usuario.findOne({where: {id:req.params.id}});
    
             res.render('editUsuario', { 
            usuario: usuarios.toJSON()   // ← converte p/ plain object
            });
        }
        else
        {
            res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
        }
});

router.post('/editUsuario',(req, res) =>{
    const {id} = req.body;
    const{nome,email,login,senha,ativo} = req.body;

    Usuario.findOne({where: {id:id}})
    .then(usuario =>{
        if(!usuario){
            console.log("Nenhum Usuário encontrado!");
        } else {
            usuario.update({nome,email,login,senha,ativo})
            .then(() => res.redirect('/usuarios/admUsuarios'))
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});

//remover usuários
router.get('/removerUsuario/:id', async (req,res) => {
    const {id}=req.params;
    
    try{
        const usuarios = await Usuario.findOne({where:{id:id}});
        if(!usuarios){
            return res.status(404).send("Nenhum Usuário Encontrado para remover");
        }
        await usuarios.update({ativo:0});
        res.redirect('/usuarios/admUsuarios');
    }
    catch(err){
        console.log(err);
        res.status(500).send("Ocorreu um erro ao excluir o Usuário");
    }
});


module.exports = router