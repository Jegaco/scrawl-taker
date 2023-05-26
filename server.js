const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Route for stored notes data as JSON
app.get('/api/notes', async (req, res) => {
  const parseDb = await JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  res.json(parseDb);
});

// Route for new notes, pushes 
app.post('/api/notes', (req,res) => {
  const parseDb = JSON.parse(fs.readFileSync("db/db.json", "utf8"))
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };

  parseDb.push(newNote);
  fs.writeFileSync("db/db.json", JSON.stringify(parseDb));
  res.json(parseDb);
});

// Route returns the index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')
));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);