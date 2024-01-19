const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    verifyAndSend(9797921672)
});


// Function that will be called on getting any message
client.on('message', async (message) => {
  console.log(message);
	if (message.body === '!ping') {
		await message.reply('pong');
	}

  if (message.body === '!send-media') {
        // How to send media 👇
        const media = MessageMedia.fromFilePath('./index.js');
        await client.sendMessage(message.from, media);
  }

});



// Function to verify user and send document
const verifyAndSend = async (number) => {
  sanitized_number = number.toString().replace(/\D/g, "");
  // console.log(sanitized_number);

  const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; 
  // console.log({final_number});

  const number_details = await client.getNumberId(final_number);
  // console.log({number_details});

  if (!number_details) {
    console.log(`${final_number} is not on whatsapp`);
    return
  }

  client.isRegisteredUser(number_details._serialized).then(function(isRegistered) {
    if(isRegistered) {
        const media = MessageMedia.fromFilePath('./public/demo.jpg'); // Change to whatever you have to send
        client.sendMessage(number_details._serialized , media);
    }
})  
}




client.initialize();
