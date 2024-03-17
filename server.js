const express = require('express');
const { client, verifyAndSendAsync } = require('./index');
const fs = require('fs');
const csvToArray = require('./csvToArray');

let count = 0;
var app = express();

app.get('/', (req, res) => {
    console.log('Hello');
    res.send('Hello');
});

app.get('/send-message', async (req, res) => {
    try {
        const phoneNumbers = csvToArray('./public/test.csv');

        for (let index = 0; index < 3; index++) {

            fs.readFile('index.txt', 'utf8', async (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ status: false, message: "Error reading index file" });
                }
                count = parseInt(data);

                // Increment the count
                count++;

                // Write the updated count back to the file
                fs.writeFile('index.txt', count.toString(), (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: false, message: "Error updating index file" });
                    }
                    console.log('Count updated successfully.');
                });

                console.log(count);

                await verifyAndSendAsync(phoneNumbers[count]);
                res.json({ status: true, message: "Message Sent" });
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Message Not Sent" });
    }
});

app.listen(3000, () => {
    client.initialize();
    console.log('Listening on 3000');
});
