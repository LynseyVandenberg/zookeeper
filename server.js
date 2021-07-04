const express = require('express');
const app = express();
const fs = require('fs'); //imports and uses the fs library
const path = require('path'); //writes the data to the animals.json file
const { animals } = require('./data/animals');
const PORT = process.env.PORT || 3001;

// parse incoming string or array data -  It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object - extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data -  method takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
    } else {
        personalityTraitsArray = query.personalityTraits;
      }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }

    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
  }

  function findById(id, animalsArray) {
      const result = animalsArray.filter(animal => animal.id ===id)[0];
        return result
  };

  function createNewAnimal(body, animalsArray) {
    const animal = body;
    console.log(body);
    // our function's main code will go here!
    animalsArray.push(animal);
    fs.writeFileSync( //synchronous version of fs.writeFile() and doesn't require a callback function.
      path.join(__dirname, './data/animals.json'), //__dirname represents the directory of the file we execute the code in,
      JSON.stringify({ animals: animalsArray }, null, 2) //converts and formats to save as JSON - null means we don't want to edit it further - 2 means white space between values for ease fo reading
    );
    // return finished code to post route for response
    return animal;
  };

    app.get('/api/animals', (req, res) => {
        let results = animals;
        if (req.query) {
          results = filterByQuery(req.query, results); //this query is for multiple parameteres
        }
        res.json(results);
      });

    app.get('/api/animals/:id', (req, res) => {
        const result = findById(req.params.id, animals); //this query is for a single specific property, usually intended to grab a single record
        if (result) {
            res.json(result);
        } else{
            res.sendStatus(400);
        }
    });
  
app.post('/api/animals', (req, res) => { //POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than vice versa.
  // req.body is where our incoming content will be 
  req.body.id = animals.length.toString();
  console.log(req.body); //using console.log to view the data being entered at http in order to post to server
  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);
  res.json(req.body);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});