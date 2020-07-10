const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

function validadeRepositoryId(request, response, next) {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository ID not found' });
  }

  request.repositoryIndex = repositoryIndex;
  return next();
}

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", validadeRepositoryId, (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request;

  const oldRepository = repositories[repositoryIndex];
  const newRepository = {
    id: oldRepository.id,
    title,
    url,
    techs,
    likes: oldRepository.likes
  }

  repositories[repositoryIndex] = newRepository;
  return response.json(newRepository);
});

app.delete("/repositories/:id", validadeRepositoryId, (request, response) => {
  const { repositoryIndex } = request;
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validadeRepositoryId, (request, response) => {
  const { repositoryIndex } = request;
  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
