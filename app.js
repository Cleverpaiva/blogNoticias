const express = require('express');
const app = express();
const exphbs = require('express-handlebars')
const db = require('./db/connection');
const bodyParser = require('body-parser');
const path = require('path');
const Noticia = require('./models/Noticia');
const session =require('express-session');

const PORT = 3000;
app.listen(PORT, function(){
    console.log(`O Express está rodando na porta ${PORT}`);
});

app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'qwertasdfg1234509876'}));

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

//handlebars
app.set('views', path.join(__dirname,'views'));
const hbs = exphbs.create({
    helpers: {
        verValido: (valor) => {
            return valor === 's' || valor === 'n' ? valor : 's'; // fallback para s
        },
        eq: (a, b) => (a === b)
    }
});


app.engine('handlebars',exphbs.engine({extname:'.handlebars',defaultLayout:'main'}));
app.set('view engine','handlebars');

db
.authenticate()
.then(() =>{
    console.log("Conectado ao banco de dados!");  
})
.catch(err => {
    console.log("Erro ao conectar ao banco de dados", err);
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.get('/login', (req,res) => {
    res.render('login');
});

/*
app.get('/',(req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%';

    if(!search){
        Noticia.findAll({order:[
            ['createdAt','DESC']
        ]})
        .then(noticias => {
    
            res.render('index',{
                noticias
            });
        })
        .catch(err =>console.log(err));

    } else {
        Noticia.findAll({
            where: {titulo: {[Op.like]:query}},
            order:[
            ['createdAt','DESC']
        ]})
        .then(noticias => {
    
            res.render('index',{
                noticias, search
            });
        })
        .catch(err =>console.log(err));; 
    }
    
});
*/

//impedir que usuário volte pelo voltar do navegador


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Erro ao encerrar a sessão:", err);
            return res.redirect('/dashboard'); // Ou onde o usuário estava
        }
        // Limpa o cookie do navegador para segurança extra
        res.clearCookie('connect.sid'); 
        // Redireciona para a página de login ou home
        res.redirect('/login'); 
    });
});

app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%' + search + '%';

    // 📍 Caso não tenha pesquisa
    if(!search){

        Noticia.findAll({
            where: { ver: 's' },       // ← Filtra apenas noticias com ver = 's'
            order: [['createdAt','DESC']]
        })
        .then(noticias => {
            res.render('index', { noticias });
        })
        .catch(err => console.log(err));

    } else {

        // 📍 Caso tenha pesquisa
        Noticia.findAll({
            where: {
                ver: 's',             // ← Mantém o filtro
                titulo: { [Op.like]: query }
            },
            order: [['createdAt','DESC']]
        })
        .then(noticias => {
            res.render('index', { noticias, search });
        })
        .catch(err => console.log(err));
    }

});




//rota administração
app.get('/adm',(req,res) => {
    if (req.session.login){
        let search = req.query.job;
        let query = '%'+search+'%';

        if(!search){
            Noticia.findAll({order:[
                ['createdAt','DESC']
            ]})
            .then(noticias => {
    
                res.render('adm',{
                noticias
                });
            })
            .catch(err =>console.log(err));

        } else {
            Noticia.findAll({
                where: {titulo: {[Op.like]:query}},
                order:[
                ['createdAt','DESC']
            ]})
            .then(noticias => {
    
                res.render('adm',{
                    noticias, search
                });
            })
            .catch(err =>console.log(err));; 
        }
    }
    else{
        res.send('<h> Você não está autorizado para acessar essa página</h1><p><a href="/usuarios/login">Faça seu Login</a></p>');
    }
    

});

app.use('/noticias', require('./routes/noticias'));
app.use('/usuarios',require('./routes/usuarios'));
app.use('/comentarios',require('./routes/comentarios'));
app.use('/categorias',require('./routes/categorias'));