const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');
const Comentario = require('../models/Comentario');
const Categoria = require('../models/Categoria');
const session = require('express-session');

//adicionando noticia via post
router.post('/add',(req,res) => {
    
        let{id,idCategoria,titulo,subti,texto,nomeAutor,cidAutor,fotos,ver} = req.body;

        //inserindo noticias
        Noticia.create({
            id,
            idCategoria,
            titulo,
            subti,
            texto,
            nomeAutor,
            cidAutor,
            fotos,
            ver
        })
        .then(() =>res.redirect('/adm'))//redireciona para a home
        .catch(err => console.log(err));
    
    
});

router.get('/add', (req,res) =>{
    if (req.session.login){
   // res.render('add');
        Categoria.findAll({
            order:[['createdAt','ASC']]
        })
        .then(categorias =>{
            res.render('add',{categorias});
        })
        .catch(err => console.log(err));
    }
    else{
        res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }
});



router.get('/editNoticia/:id', async (req, res) => {
    if (req.session.login) {
        try {
            // Realiza as duas buscas simultaneamente
            const [noticia, categorias] = await Promise.all([
                Noticia.findOne({ where: { id: req.params.id } }),
                Categoria.findAll({ order: [['nome', 'ASC']] })
            ]);

            if (!noticia) {
                return res.status(404).send("Notícia não encontrada.");
            }

            // Renderiza enviando a notícia (objeto) e categorias (array)
            res.render('atualiza', {
                noticia: noticia.toJSON(),
                categorias: categorias.map(c => c.toJSON())
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Erro ao carregar dados para edição.");
        }
    } else {
        res.send('<h1>Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }
});


router.post('/editNoticia',(req, res) =>{
    const {id} = req.body;
    const{idCategoria,titulo,subti,texto,nomeAutor,cidAutor,fotos,ver} = req.body;

    Noticia.findOne({where: {id}})
    .then(noticia =>{
        if(!noticia){
            console.log("Nenhum noticia encontrado!");
        } else {
            noticia.update({idCategoria,titulo,subti,texto,nomeAutor,cidAutor,fotos,ver})
            .then(() => res.redirect('/adm'))
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});

router.get('/removerNoticia/:id', async (req,res) => {
    const id=req.params;

    try{
        const noticia = await Noticia.findOne({where:id});
        if(!noticia){
            return res.status(404).send("Nenhum Noticia Encontrado para remover");
        }
        await noticia.destroy();
        res.redirect('/adm');
    }
    catch(err){
        console.log(err);
        res.status(500).send("Ocorreu um erro ao excluir a noticia");
    }
});



router.get('/news/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const noticia = await Noticia.findOne({
      where: { id },
      include: [
        {
          model: Comentario,
          where: { aprovado: 1 },
          required: false // mantém a notícia mesmo sem comentários aprovados
        }
      ]
    });

    if (!noticia) {
      return res.status(404).send("Notícia não encontrada");
    }

    res.render('news', {
      noticia: noticia.toJSON()
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao carregar a notícia");
  }
});

router.get('/newsCategoria/:idCategoria', async (req, res) => {
    const { idCategoria } = req.params;

    Noticia.findAll({
        where: { 
            idCategoria: idCategoria,
            ver: 's' // Adicionado conforme seu comentário de filtro 
        },
        order: [['createdAt', 'DESC']]
    })
    .then(noticias => {
        // Converte o array de modelos para objetos literais JS
        const noticiasPlain = noticias.map(n => n.get({ plain: true }));
        
        res.render('newsCategoria', { noticias: noticiasPlain });
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Erro ao buscar notícias");
    });
});

router.use('/categorias',require('../routes/categorias'));
module.exports = router