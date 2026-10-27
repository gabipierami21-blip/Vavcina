//https://expressjs.com/ commonjs
//https://expressjs.com/pt-br/resources/middleware/cors/
//https://www.npmjs.com/package/mssql
// modulo(biblioteca de criar um servidor)
const express = require('express');
const { sql, Conectar } = require('./database.js');
// cors
const cors = require('cors');
const app = express();
// porta de saida do servidor
const port = 3000;
// retornar o agente(navegador) em tipo json resposta
app.use(express.json());
//aplicando cors no agente(navegador)
app.use(cors());
// saida de resposta são chamado de rotas
app.get('/', async (req, res) => {
  // tipo de resposta de requisição
  //res.send("<h1>Página</h1>"); 
  // FAZER CONEXAO COM O BANCO
  const cn = await Conectar();
  // passar em forma de string um comando sql // ARRAY
  const resultado = await cn.request().query("SELECT * FROM USUARIO");
  res.json(resultado.recordset);
  //res.json({ "status": "sim" });
})

// inserir dados
app.post("/INSERT", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const telefone = req.body.telefone;
  const senha = req.body.senha;
  const cpf_cnpj = req.body.cpf_cnpj;
  const tipo_pessoa = req.body.tipo_pessoa;
  const data_nasc = req.body.data_nasc;
  //conexao
  const cn = await Conectar();
  // sql string
  const resultado = await cn
    .request()
    .input('nome', sql.VarChar(100), nome)
    .input('email', sql.VarChar(100), email)
    .input('telefone', sql.VarChar(20), telefone)
    .input('senha', sql.VarChar(255), senha)
    .input('cpf_cnpj', sql.VarChar(18), cpf_cnpj)
    .input('tipo_pessoa', sql.Char(1), tipo_pessoa)
    .input('data_nasc', sql.Date, data_nasc)
    .query(`
           INSERT INTO USUARIO(
             nome,
             email,
             telefone,
             senha,
             cpf_cnpj,
             tipo_pessoa,
             data_nasc
           ) 
             OUTPUT INSERTED. *
             VALUES(
                @nome,
                @email,
                @telefone,
                @senha,
                @cpf_cnpj,
                @tipo_pessoa,
                @data_nasc
             )     
      `)

  res.status(201).json({
    "mensagem": "Usuário cadastrado com sucesso!!!",
    "usuario": resultado.recordset[0]
  })


  /*  res.json({ 
     'nome' : nome, 
     'email' : email,
     'telefone': telefone,
     'senha': senha,
     'tipo ': tipo_pessoa,
     'cpf_cnpj' : cpf_cnpj,
      'data': data_nasc        
   }) */

  //res.json({"dado": nome});

});

// CRIAR A EXECUÇÃO DO SERVIDOR
app.listen(port, () => {
  console.log(`servidor http://localhost:${port}`);
})

// delete

app.delete("/usuario/:id", async (req, res) => {
  // parametro via http (url)
  const ID = req.params.id
  const cn = await Conectar();
  const resultado = await cn
    .request()
    .input('id', sql.Int, ID)

    .query(`
      DELETE FROM USUARIO
      OUTPUT DELETED. *
        WHERE id_usuario = @id
    `)

  // resultado.rowAffected[0]
  if (resultado.recordset.length === 0) {
    res.json({ "mensagem": "não encontrado nenhum usuário!" })
  }
  else {
    res.json({ " mensagem": "deletado!" })
  }

  // mandar resposta para usuario
  res.json({
    "id": ID
  });
})

