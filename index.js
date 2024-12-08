




/*Desenvolva um sistema web para uma sala de bate-papo que atenda aos seguintes requisitos:

* Cadastro de usuários: Deve ser possível cadastrar os usuários da sala de bate-papo,
incluindo nome, e-mail e senha.

* Login e logout: Deve ser possível fazer login e logout da sala de bate-papo.

* Envio e listagem de mensagens: Deve ser possível enviar mensagens para outros usuários
da sala de bate-papo, além de poder visualizá-las.
*/

import express from 'express';
//importando session do modulo express-session;
import session from 'express-session';

//importando o modulo cookie-parser para permitir que a nossa aplicação solicite e retorne cookies
import cookieParser from 'cookie-parser';

import path from 'path';

const app = express();

app.use(express.urlencoded({ extended: true }));

//configurar uma sessao a fim de pertmitir que a aolicaçao seja capaz de lembrar com quem ela esta falando.
//Em outras palabvras, ele vai armazenar as informacoes do usuario que estiver logado.
app.use(session({
    secret: 'Minh4Chav3S3cr3t4',
    resave: false, //Não salva a sessão se nao houver mudanças
    saveUninitialized: true,//
    cookie: {
        maxAge: 1000 * 60 * 30// maxAge funciona em milisegundos: 1 segundo tem 1000 milisegundos * 60 desses milisegundos tem 1 minuto * 30 tem 30 minutos
        //Se o usuario fizer logout, a sessão vai ser expirada automaticamente
    }
}))
//ADICIONANDO O MEDIOWARE COOKIE-PARSER
app.use(cookieParser());

app.use(express.static('./public'));

//configurar a pasta public para servir arquivos estáticos
//permitindo que o conteúdo de uma determinada pasta seja visivel para os usuarios
app.use(express.static('.pagnas/public'));

const porta = 3000; 
const host = 'localhost'; //ip refere-se a todas as interfaces locais(placas de rede do seu pc)



var listafuncionario = []; // lista para armazenar funcionarios cadastrados
//implementar a funcionalidade para entregar um formulario html para o cliente
function cadastro(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <body>

                <div>
                    <h1>Cadastro de Usuário</h1>
                    <form method="POST" action="/cadastrarusuario" class="row g-3" novalidate>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">*Nome do Cadastrado</label>
                            <input type="text" class="form-control" id="nome" name="nome">
                        </div>

                             <div class="col-md-4">
                            <label for="validationCustomUsername" class="form-label">*Email </label>
                                <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">@</span>
                                <input type="number" class="form-control" id="Email" name="email">
                                </div>
                        </div>

                        <div class="col-md-3">
                                <label for="senhas" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="senhas" name="senhas">
                            </div>

                    <div class="col-12">
                        <button class="btn btn-primary" type="submit">Cadastrar</button>
                    </div>
                    </form>
                    </div>
            </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
    `);
}

function menuView(req,resp) {

    const dataHoraUltimoAcesso = req.cookies.dataHoraUltimoAcesso;

    if(!dataHoraUltimoAcesso){
        dataHoraUltimoAcesso='';}
    resp.send(`
<html><head>
<title>Cadastro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <meta charset="utf-8">
    </head>
    <body>
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/cadastrarusuario">MENU</a>
            <div class="navbar-nav">
                <a class="nav-link active" aria-current="page" href="/cadastrarusuario">Cadastrar Produto</a>
                <li class="nav-item">
                <a class="nav-link disabled" aria-disabled="true">Seu Ultimo acesso foi realizado em: ${dataHoraUltimoAcesso}</a>
                </li>
            </div>
            </div>
        </div>
        </nav>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html>`);
}

function cadastrarusuario(req, resp){
    //recupera dados do formulário
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senhas;
   

    

//Validar a entrada do Usuario
//caso os dados não estiverem validos nos deveremos retornar um feedback

    if(nome&& email&& senha){
        
        const funcionario = {nome,email, senha};

        //adiciona funcionarios a cada envio
        listafuncionario.push(funcionario);
        //Mostrar a Lista de funcionarios já cadastrados
        resp.write(`
            <html>
                <head>
                    <title> funcionarios Cadastrados </title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">           
                </head>
                <body>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Nome do Cadastrado</th>
                            <th scope="col">email</th>
                            <th scope="col">senha</th>
                        </th>
                    </thead>
                    <tbody>
                    `);

                    for (var i = 0; i <listafuncionario.length; i++) {
                        resp.write(`
                            <tr>
                                <td>${listafuncionario[i].nome}</td>                        
                                <td>${listafuncionario[i].email}</td> 
                                <td>${listafuncionario[i].senha}</td>
                            </tr>
                            `);
                        
                    }

        resp.write(`</tbody>
                </table>
                <a type="button" href="/cadastrarusuario">Continuar Cadastrando</a>
                </body>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
            `);
    }//fim da validação
    else{

        resp.write(`
            
            <html>
                <head>
                    <title>Cadastro de Produtos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    <meta charset="utf-8">
                </head>
                <body>

                    <div>
                        <h1>Cadastro de funcionario</h1>
                        <form method="POST" action="/cadastrarusuario" class="row g-3" novalidate>
                            <div class="col-md-4">
                                <label for="nome" class="form-label">*Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome" value="${nome}">
                            </div>
            `);
            if(!nome){
                resp.write(`
                    <div>
                        <span><p class="text-danger">O campo nome deve ser preenchido</p></span>
                    </div>
                    `);
            }
            resp.write(`
                <div class="col-md-4">
                    <label for="validationCustomUsername" class="form-label">*Email</label>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" class="form-control" id="Email" name="email" value="${email}">
                    </div>
                </div>
                `);

            if(!email){
                resp.write(`
                <div>
                    <span><p class="text-danger">O campo email deve ser preenchido</p></span>
                </div>
                `);
            }

            resp.write(`
                <div class="col-md-6">
                    <label for="senhas"class="form-label">Senha</label>
                    <input type="number" class="form-control" id="senhas" name="senhas" value="${senha}">
                </div>
                                `);

            if(!senha){
                resp.write(`
                <div>
                    <span><p class="text-danger">O campo Senha deve ser preenchido</p></span>
                </div>
                `);
            }

        resp.write(`
        </div>

                    <div class="col-12">
                        <button class="btn btn-primary" type="submit">Cadastrar</button>
                    </div>
                    </form>
                    </div>
            </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
        `);
    }//else da validação
        resp.end();//envia a resposta
     
}
function autenticarLogin(req, resp){ 
    const login = req.body.usuario;
    const senha = req.body.senha;

    if(login === 'admin' && senha === '123'){//registrar
        //Criar uma sessão individualmente para cada usuario que faça login
        req.session.usuarioLogado = true;
        //criar um cookie enviando para o navegador a data e hora de acesso do usuario
        resp.cookie('dataHoraUltimoAcesso', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/')
    }   
    else{
        resp.send(`
        <html>
        <head>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
            <body>
            <div class="container w-25">
                <div class="alert alert-danger" role="alert"> 
                Usuário ou senha inválidos!
                </div>
                <div>
                <a href="/login.html" class="btn btn-primary" role="button">Tentar novamente</a>
                </div>
            </div>
            </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
        </script>
        </html>
        `);
    }

}

//é o nosso middleware de segurançanca
function verificarAutenticacao(req, resp, next) {
    if(req.session.usuarioLogado){
        next();//permita acessar os recursos solicitados
    }
    else{
        resp.redirect('/login.html');
    }
}

app.get('/login',(req,resp) =>{  

    resp.sendFile(path.join(__dirname, 'public', 'login.html'));
    //resp.redirect('/login.html');
});
app.post('/login',autenticarLogin);
app.get('/',verificarAutenticacao, menuView);
app.get('/cadastrarusuario',verificarAutenticacao, cadastro);//envia o formulario para cadastrar o personagem
app.post('/cadastrarusuario',verificarAutenticacao, cadastrarusuario);


app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
})