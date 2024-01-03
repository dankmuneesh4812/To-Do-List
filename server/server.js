const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Updated MongoDB connection using the new syntax and additional options
mongoose.connect(`mongodb+srv://TODOLIST:TODOLIST@todolist.bigsndf.mongodb.net/myDatabase`)
  .then(() => {
    console.log('Database connected successfully'); // Print success message

    // Define mongoose schemas and models, and start your Express app
    const todoSchema = new mongoose.Schema({
      task: String,
      completed: Boolean,
    });

    const Todo = mongoose.model('Todo', todoSchema);

    app.post('/api/todos', async (req, res) => {
      const { task, completed } = req.body;
      const newTodo = new Todo({ task, completed });
      await newTodo.save();
      res.json(newTodo);
    });

    app.get('/api/todos', async (req, res) => {
      const todos = await Todo.find();
      res.json(todos);
    });

    app.delete('/api/todos/:id', async (req, res) => {
        const taskId = req.params.id;      
        // Perform the deletion logic (use Mongoose or your preferred database library)
        // Example using Mongoose:
        await Todo.findByIdAndDelete(taskId);
      
        res.json({ success: true });
      });

    app.put('/api/todos/:id', async (req, res) => {
        const taskId = req.params.id;
      
        // Perform the update logic (use Mongoose or your preferred database library)
        // Example using Mongoose:
        await Todo.findByIdAndUpdate(taskId, { completed: true });
      
        res.json({ success: true });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
