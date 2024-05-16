const db = require("../../data/dbConfig.js");

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
};

function getAll() {
  return db("hobbits");
}

function getById(id) {
  return db("hobbits")
  .where("id", id)
  .first();
}

async function insert(hobbit) {
  return await db('hobbits').insert(hobbit).then(([id]) => {
    return db('hobbits').where('id', id).first()
  })
}

async function update(id, changes) {
  // Update only the specified changes in the database
  await db('hobbits')
    .where({ id })
    .update(changes);
  return await getById(id); // Get the updated hobbit for response
}

async function remove(id) {
  const deletedCount = await db('hobbits')
    .where({ id })
    .del(); // Use .del() for delete operation
  return deletedCount;
}
