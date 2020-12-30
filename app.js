// import modules and libraries i.e morgan, express..

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies.json');

// create app var and set uses
const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// validateBearerToken function, first in pipeline
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  
  next();
});

// .get for the path of /movie
// make sure to assign a var for dataset of MOVIES
// want to search by genre, country or rating

app.get('/movie', function handleGetMovie(req, res) {

  // our response we are looking through is the dataset MOVIES
  let response = MOVIES;

  // if there is a country search, filter through response, setting all strings
  // to lowercase, and using .includes
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  // if there is a genre search, filter through response, setting all strings
  // to lowercase, and using .includes
  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }


  // if searching by vote, show all movies that are greater than or equal to
  // the user's supplied number. Using JS method Number() is easiest to compare
  if (req.query.avg_vote) {
    response = response.filter(movie =>
      // queryNum >= MovieRating
      Number(req.query.avg_vote) >= Number(movie.avg_vote)
    );
  }

  // use json() to autoformat our response and send it to client
  res.json(response);
});



app.listen(8000, () => {
  console.log('Server listening at http://localhost:8000');
});