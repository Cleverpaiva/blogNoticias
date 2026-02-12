const express = require('express');
const router = express.Router();
const Comentario = require('../models/Comentario');
const Noticia = require('../models/Noticia');


router.post('/addComent',(req,res)=>{
    const {idNot}=req.body;
    let{idComent,nome,email,conteudo,aprovado}= req.body;

    //inserindo comentários
    Comentario.create({
        idComent,
        idNot,
        nome,
        email,
        conteudo,
        aprovado
    })
    .then(() => {
        // Em vez de redirect, enviamos um script para fechar a janela
        res.send(`
            <script>
                alert("Comentário enviado com sucesso!");
                window.close();
            </script>
        `);
    })
    .catch(err =>console.log(err));
});

router.get('/coment/:id', (req,res)=>{
    Noticia.findOne({where:{id:req.params.id}})
    .then((noticias)=>{
        //res.render('addComentarios',{noticias});
         res.render('addComentarios', { 
            noticias: noticias.toJSON()   // ← converte p/ plain object
            });
    }).catch((err)=>{
        console.log(err)
    });

});

router.get('/news',(req,res)=>{
    res.render('news');
})

router.get('/admComentarios',(req,res) => {
    if (req.session.login){
        let search = req.query.job;
        let query = '%'+search+'%';

        if(!search){
            Comentario.findAll({order:[
                ['createdAt','DESC']
            ]})
            .then(comentarios => {
    
                res.render('admComentarios',{
                comentarios
                });
            })
            .catch(err =>console.log(err));

        } else {
            Comentario.findAll({
                where: {nome: {[Op.like]:query}},
                order:[
                ['createdAt','DESC']
            ]})
            .then(comentarios => {
    
                res.render('admComentarios',{
                    comentarios, search
                });
            })
            .catch(err =>console.log(err));; 
        }
    }
    else{
        res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }

});

//remover comentários
router.get('/removerComentario/:idComent', async (req,res) => {
    const {idComent}=req.params;
    //const{aprovado}=req.body;
    try{
        const comentarios = await Comentario.findOne({where:{idComent:idComent}});
        if(!comentarios){
            return res.status(404).send("Nenhum Comentário Encontrado para remover");
        }
        await comentarios.update({aprovado:0});
        res.redirect('/comentarios/admComentarios');
    }
    catch(err){
        console.log(err);
        res.status(500).send("Ocorreu um erro ao excluir o comentario");
    }
});

//editar comentario
router.get('/editComentario/:id', async (req,res) => {
        if(req.session.login){
            const comentarios = await Comentario.findOne({where: {idComent:req.params.id}});
    
             res.render('editComentario', { 
            comentario: comentarios.toJSON()   // ← converte p/ plain object
            });
        }
        else
        {
            res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
        }
});

router.post('/editComentario',(req, res) =>{
    const {id} = req.body;
    const{nome,email,conteudo,aprovado} = req.body;

    Comentario.findOne({where: {idComent:id}})
    .then(comentario =>{
        if(!comentario){
            console.log("Nenhum comentario encontrado!");
        } else {
            comentario.update({nome,email,conteudo,aprovado})
            .then(() => res.redirect('/comentarios/admComentarios'))
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});



module.exports =router

