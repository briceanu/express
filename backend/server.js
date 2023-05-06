const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
const Todo = require('./models/Todo');
mongoose
  .connect(
    `mongodb+srv://Teodor:${process.env.PASSWORD}@cluster.vub1zsc.mongodb.net/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('conected to DB'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(cors());

app.post('/saveTodo', (req, res) => {
  const todo = new Todo({ text: req.body.text });
  todo.save();
  res.json(todo);
});
app.get('/fetchTodos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.delete('/deleteTodo/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  res.json(todo);
});

app.get('/todoComplete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) {
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
  } else {
    res.status(404).json({ message: 'todo not found' });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`app listening on ${process.env.PORT}`)
);
