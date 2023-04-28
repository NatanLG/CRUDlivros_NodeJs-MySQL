const express = require('express');
const server = express();
server.use(express.json());

require('dotenv').config({path: 'variaveis.env'})
const db = require('../CRUDlivros/db');

//lista a porta utilizada
server.listen(process.env.PORT, () =>{
    console.log(`Servidor rodando em: http://localhost: ${process.env.PORT}`);
})


// Retornar um livro
server.get('/livros/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM dbApiLivros.livros WHERE codigo = ${id}`, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        return res.json(results[0]);
    });
});

// Retornar todos os livros
server.get('/livros', (req, res) => {
    db.query('SELECT * FROM dbApiLivros.livros', (error, results) => {
        if (error) throw error;
        return res.json(results);
    });
});

// Criar um novo livro
server.post('/livros', (req, res) => {
    const { name } = req.body;
    db.query(`INSERT INTO dbApiLivros.livros (nome) VALUES ('${name}')`, (error, results) => {
        if (error) throw error;
        return res.json({ id: results.insertId, name });
    });
});

// Atualizar um livro
server.put('/livros/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    db.query(`UPDATE dbApiLivros.livros SET nome = '${name}' WHERE codigo = ${id}`, (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        return res.json({ id, name });
    });
});

// Deletar um livro
server.delete('/livros/:id', (req, res) => {
    const id = req.params.id;
    db.query(`DELETE FROM dbApiLivros.livros WHERE codigo = ${id}`, (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        return res.json({ message: "O livro foi deletado" });
    });
});

