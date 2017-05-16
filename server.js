const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.set('port', process.env.PORT || 3000);
app.locals.title = 'DenverArt';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (request, response ) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
});

// app.get('/api/v1/folders', (request, response) => {
//   database('folders').select()
//     .then(folders => response.status(200).json(folders))
//     .catch(error => console.error('error: ', error))
// });


if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  });
}

module.exports = app;
