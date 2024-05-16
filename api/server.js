const express = require("express");
const Hobbits = require("./hobbits/hobbits-model.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/hobbits", (req, res) => {
  Hobbits.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id", (req, res) => {
  const { id } = req.params;
  Hobbits.getById(id)
    .then(hobbit => {
      if (hobbit) {
        res.status(200).json(hobbit);
      } else {
        res.status(404).json({ message: "Hobbit not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/hobbits", async (req, res) => {
  try {
    const newHobbit = await Hobbits.insert(req.body);
    res.status(201).json(newHobbit);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.delete("/hobbits/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hobbitToDelete = await Hobbits.getById(id);
    if (hobbitToDelete) {
      await Hobbits.remove(id);
      res.status(200).json({ message: "Hobbit deleted successfully" });
    } else {
      res.status(404).json({ message: "Hobbit not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

server.put("/hobbits/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const updatedHobbit = await Hobbits.update(id, changes);
    if (updatedHobbit) {
      res.status(200).json(updatedHobbit);
    } else {
      res.status(404).json({ message: "Hobbit not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = server;