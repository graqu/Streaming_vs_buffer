const fs = require('fs');
const csv = require('csv-parser');

let runningStats = [];
///BUFFER METHOD
const readCsvFromFile = (path, id) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }

      const lines = data.split('\n');
      const headers = lines[0].split(',');

      lines.slice(1).forEach((line) => {
        const values = line.split(',');
        const result = {};
        headers.forEach((header, index) => {
          result[header.trim()] = values[index] ? values[index].trim() : '';
        });
        results.push(result);
      });

      resolve(results);
    });
  });
};

// const readStreamCsvFromFile = async (path) => {
//   const stream = fs.createReadStream(path);
//   try {
//     for await (const chunk of stream) {
//       return true;
//     }
//   } catch (error) {
//     console.error('Error occured with loading file by stream:', error);
//     reject(error);
//   }
// };
//STREAM METHOD
const readStreamCsvFromFile = (path, id) => {
  const startStreamingTime = new Date();
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        resolve();
      })
      .on('end', () => {
        console.log('data-loaded using stream');
        updateStreamingTime(id, startStreamingTime);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const updateStreamingTime = (id, timeStamp) => {
  const testCase = runningStats.find((stat) => stat.id === id);
  const finishTimeStamp = new Date();
  const fullTime = finishTimeStamp - timeStamp;
  testCase.processed = fullTime;
};

module.exports = {
  readCsvFromFile,
  readStreamCsvFromFile,
  runningStats,
};
