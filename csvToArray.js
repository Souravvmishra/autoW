const fs = require('fs');

function csvToArray(file_path) {
    /**
     * Convert a CSV file with one column into a JavaScript array.
     *
     * @param {string} file_path - Path to the CSV file.
     * @returns {Array} - JavaScript array containing the values from the CSV file.
     */
    const resultArray = [];

    const fileContent = fs.readFileSync(file_path, 'utf-8');
    const rows = fileContent.split('\n');

    for (const row of rows) {
        // Assuming one column in the CSV
        const value = row.trim().split(',')[0].replace(' ', '');
        resultArray.push(value);
    }

    return resultArray;
}


module.exports = csvToArray
