const { Todo } = require("./models");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// get all todos
app.get("/api/v1/todo", async (req, res) => {
    try {
        const data = await Todo.findAll();
        res.status(200).json({
            STATUS: "OK",
            data,
        });
    } catch (error) {
        res.status(500).json({
            STATUS: "FAILED",
            data: { name: error.name, message: error.message, stack: error.stack },
        });
        console.log("Error : ", error.message);
    }
});

// get one todo
app.get("/api/v1/todo/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Todo.findOne({ where: { id } });
        res.status(200).json({
            STATUS: "OK",
            data,
        });
    } catch (error) {
        res.status(500).json({
            STATUS: "FAILED",
            data: { name: error.name, message: error.message, stack: error.stack },
        });
        console.log("Error : ", error.message);
    }
});

// create todo
app.post("/api/v1/todo", async (req, res) => {
    const { title, priority, isFinished } = req.body;
    try {
        const data = await Todo.create({ title, priority, isFinished: false });
        res.status(201).json({
            STATUS: "OK",
            data,
        });
    } catch (error) {
        res.status(500).json({
            STATUS: "FAILED",
            data: { name: error.name, message: error.message, stack: error.stack },
        });
        console.log("Error : ", error.message);
    }
});

// update todo
app.put("/api/v1/todo/:id", async (req, res) => {
    const { id } = req.params;
    const { title, priority, isFinished } = req.body;

    try {
        const data = await Todo.update({ title, priority, isFinished }, { where: { id } });
        res.status(201).json({
            STATUS: "OK",
            data,
        });
    } catch (error) {
        res.status(500).json({
            STATUS: "FAILED",
            data: { name: error.name, message: error.message, stack: error.stack },
        });
        console.log("Error : ", error.message);
    }
});

app.delete("/api/v1/todo/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Todo.destroy({ where: { id } });
        res.status(201).json({
            STATUS: "OK",
            data,
        });
    } catch (error) {
        res.status(500).json({
            STATUS: "FAILED",
            data: { name: error.name, message: error.message, stack: error.stack },
        });
        console.log("Error : ", error.message);
    }
});

app.listen(port, () => {
    console.log("Example app listening at http://localhost:" + port);
});
