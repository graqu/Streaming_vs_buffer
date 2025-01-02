const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
  readCsvFromFile,
  readStreamCsvFromFile,
  runningStats,
} = require('./controllers/loadCSV');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    method: req.body.method,
    file: req.body.files,
    fileSize: 0,
    loadingTime: '0 - choose file and methood',
    runningStats: runningStats,
  });
});

app.post('/', async (req, res) => {
  const csvName = req.body.files ? `${req.body.files}.csv` : 'micro.csv';
  const filePath = path.join(__dirname, 'public', csvName);
  const method =
    req.body.method === 'read' ? readCsvFromFile : readStreamCsvFromFile;
  const startTime = new Date();
  const csvFileSize = fs.statSync(filePath).size;
  const formattedSize = (csvFileSize / 1000000).toFixed(2);
  const id = uuidv4();

  ////RUN CHOOSEN METHOD
  try {
    await method(filePath, id);

    const succesTime = new Date();
    const loadingTime = succesTime - startTime;
    const processed = req.body.method === 'read' ? loadingTime : null;

    ///SAVE BENCHMARK DATA INTO runningStats Array
    runningStats.push({
      id,
      fileName: csvName,
      fileSize: formattedSize,
      loadingTime,
      processed,
      method: req.body.method,
    });

    ///RENDER
    res.render('index', {
      method: req.body.method,
      file: req.body.files,
      fileSize: formattedSize,
      loadingTime,
      runningStats: runningStats,
    });
  } catch (error) {
    console.error('Error loading CSV data:', error);

    ///SAVE FAILURE BENCHMARK DATA INTO runningStats Array
    runningStats.push({
      id,
      fileName: csvName,
      fileSize: formattedSize,
      loadingTime: '<error>',
      processed: '-',
      method: req.body.method,
    });

    ///RENDER
    res.status(500).render('index', {
      method: req.body.method,
      file: req.body.files,
      fileSize: (csvFileSize / 1000000).toFixed(2),
      loadingTime: `error during loading: ${error.message}`,
      runningStats: runningStats,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
