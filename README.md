# File Processing Benchmark App "Node.JS Streams vs readFile demo"

## Application Overview

This application is designed to compare the `fs.readFile` and `fs.createReadStream` methods in Node.js. The goal is to evaluate the file opening times and the asynchronous response times of these functions.

## Features

- **UI Layer**: The application includes a user interface that allows easy switching between file processing methods and selecting the appropriate file based on its size.
- **Method Comparison**: Users can choose between `fs.readFile` and `fs.createReadStream` methods and observe the differences in file processing times.

## Usage

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the application**:

   ```bash
   npm start
   ```

3. **Access the application**:
   Open your browser and go to `http://localhost:3000`.

## Important Information

The CSV files in the `public` folder are not included and need to be placed there. The required files are (the size values are only suggested as a good example for benchmark and demo purposes, but feel free to modify):

- `micro.csv` <1kB
- `small.csv` ~61Mb
- `middle1.csv` ~350Mb
- `middle2.csv` ~670Mb
- `big.csv` ~1050Mb
- `huge.csv` >2GB 

## License

This project is licensed under the MIT License.
