const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

router.get('animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results); //this query is for multiple parameteres
    }
    res.json(results);
  });

router.get('animals/:id', (req, res) => {
    const result = findById(req.params.id, animals); //this query is for a single specific property, usually intended to grab a single record
    if (result) {
        res.json(result);
    } else{
        res.sendStatus(400);
    }
});


router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });

  module.exports = router;