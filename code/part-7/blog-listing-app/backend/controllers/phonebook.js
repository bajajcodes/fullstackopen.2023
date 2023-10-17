const phonebookRouter = require("express").Router();
const Phonebook = require("../models/phonebook");
const logger = require("../utils/logger");

phonebookRouter.get("/", (_, response) => {
  Phonebook.find({}).then((persons) => response.json(persons));
});

phonebookRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Phonebook.findById(id)
    .then((person) => {
      if (!person) return response.status(404).end();
      return response.json(person);
    })
    .catch((error) => next(error));
});

phonebookRouter.post("/", async (request, response, next) => {
  const { name, number } = request.body;
  const isNameExisits = (await Phonebook.find({ name })).length > 1;

  if (isNameExisits) {
    return response
      .status(400)
      .json({ error: "name already exists in the phonebook" });
  }

  const person = new Phonebook({ name, number });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

phonebookRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Phonebook.findByIdAndRemove(id)
    .then((result) => {
      if (!result) return response.status(404).end();
      return response.status(204).end();
    })
    .catch((error) => next(error));
});

phonebookRouter.put("/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;
  const person = {
    ...(name ? { name } : {}),
    ...(number ? { number } : {}),
  };
  Phonebook.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      if (!updatedNote) return response.status(404).end();
      return response.json(updatedNote);
    })
    .catch((error) => next(error));
});

phonebookRouter.get("/info", (_, response, next) => {
  Phonebook.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${
          persons.length
        } people</p> <br /> <p>${new Date().toLocaleString()}</p>`
      );
    })
    .catch((error) => next(error));
});

module.exports = phonebookRouter;
