// estaremos criando configuração de conexão ao banco
// modulo do mssql
const sql = require("mssql/msnodesqlv8");

//criar um objeto de configuração do banco
const database ={
    //user:'',
    //password:'',
    server:'DESKTOP-DSM',
    database:'GESTAO_ANIMAL',
    options:{
        encrypt:false,
        trustServerCertificate: true,
        trustedConnection:true
    },
    driver: 'ODBC Driver 17 for SQL Server'
}
// CRIAR UMA FUNÇÃO  CONECTAR

async function Conectar(){
     const db = await sql.connect(database);
     console.log('Conectado!!!');
     return db;
}


// testar
Conectar();
module.exports={ sql,Conectar};