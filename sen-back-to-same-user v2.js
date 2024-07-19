const venom = require('venom-bot');
const fetch = require('node-fetch');

venom
    .create({
        session: 'session-name' // name of session
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    console.log('I\'m Running');
    client.onMessage((message) => {
        console.log(message);
        if (message) {
            const messageParts = message.body.split(' - ');
            if (messageParts.length === 3 && messageParts[0].startsWith('@')) {
                const number = message.from; // Use the sender's number
                const complaint = messageParts[1].trim();
                const myresponse = messageParts[2].trim();

                var myHeaders = new Headers();
                myHeaders.append("Cookie", "ARRAffinity=bc20b7669fac044c0a1a8078bf9b401e6dc2ba9a9e2f1e769f43a8cbcbac47fb; ARRAffinitySameSite=bc20b7669fac044c0a1a8078bf9b401e6dc2ba9a9e2f1e769f43a8cbcbac47fb");
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "search_term": `other person's complaint about me is\n${complaint}\n\nI typically respond to it like this\n${myresponse}\n\nrephrase my response to be without defensiveness and to make the other feel validated and heard\n\nonly include response in your response`
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://kansha-ai-backend-2.azurewebsites.net/kansha_ai/api/gpt/", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                        client
                            .sendText(number, result.data) // Send to the sender's number
                            .then((result) => {
                                console.log('Result: ', result); // return object success
                            })
                            .catch((erro) => {
                                console.error('Error when sending: ', erro); // return object error
                            });
                    })
                    .catch(error => {
                        console.log('error', error);
                        client
                            .sendText(number, 'Error processing your request.') // Send error to the sender's number
                            .catch((erro) => {
                                console.error('Error when sending error message: ', erro); // return object error
                            });
                    });
            }
        }
    });
}
