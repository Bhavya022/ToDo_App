import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnectedClient } from '../data/db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const SECRET_KEY = "TodoApp"; 

const getCollection = async (name) => {
    const client = await getConnectedClient();
    return client.db("todos").collection(name);
};

// User Registration
router.post('/register', async (req, res) => {
    const users = await getCollection("users");
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: "Missing credentials" });

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ email, password: hashedPassword });
    res.status(201).json({ msg: "User registered successfully" });
});

// User Login
router.post('/login', async (req, res) => {
    const users = await getCollection("users");
    const { email, password } = req.body;
    
    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

// GET todos for a user
router.get('/todos', authMiddleware, async (req, res) => {
    const collection = await getCollection("todos");
    const todos = await collection.find({ userId: req.user.userId }).toArray();
    res.status(200).json(todos);
});

// POST new todo
router.post('/todos', authMiddleware, async (req, res) => {
    const collection = await getCollection("todos");
    const { title, description, deadline, priority } = req.body;
    if (!title) return res.status(400).json({ msg: "Title is required" });
    
    const newTodo = await collection.insertOne({
        userId: req.user.userId,
        title,
        description: description || "",
        createdAt: new Date(),
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || "normal",
        status: false,
    });

    res.status(201).json({ msg: "Todo created", _id: newTodo.insertedId });
});

// UPDATE todo status
router.put('/todos/:id/status', authMiddleware, async (req, res) => {
    const collection = await getCollection("todos");
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;
    if (typeof status !== "boolean") return res.status(400).json({ msg: "Invalid status" });

    await collection.updateOne({ _id, userId: req.user.userId }, { $set: { status } });
    res.status(200).json({ msg: "Todo status updated" });
});

// EDIT todo content
router.patch('/todos/:id', authMiddleware, async (req, res) => {
    const collection = await getCollection("todos");
    const _id = new ObjectId(req.params.id);
    const { title, description, deadline, priority } = req.body;
    
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (deadline) updateFields.deadline = new Date(deadline);
    if (priority) updateFields.priority = priority;

    await collection.updateOne({ _id, userId: req.user.userId }, { $set: updateFields });
    res.status(200).json({ msg: "Todo updated" });
});

// DELETE todo
router.delete('/todos/:id', authMiddleware, async (req, res) => {
    const collection = await getCollection("todos");
    const _id = new ObjectId(req.params.id);
    
    await collection.deleteOne({ _id, userId: req.user.userId });
    res.status(200).json({ msg: "Todo deleted" });
});

// GET tasks with their status
router.get('/tasks/status', authMiddleware, async (req, res) => {
    const collection = await getCollection("todos");
    const tasks = await collection.find({ userId: req.user.userId }).toArray();

    const tasksWithStatus = tasks.map((task) => ({
        title: task.title,
        status: task.status,
    }));

    res.status(200).json(tasksWithStatus);
});

export default router;
