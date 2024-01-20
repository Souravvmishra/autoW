const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const csvToArray = require('./csvToArray')

const CAPTION = `*Important: New rules for coaching centers in India*

The Education Ministry has made it *mandatory* for all coaching centers to update their websites with all the details about their tutors, courses, fees, and facilities¹². *Otherwise, they will face **huge fines* and even *lose their registration*¹².

This is a big opportunity for you to showcase your coaching center to the world and attract more students. But you need a website that meets the standards and stands out from the crowd.

We are Codestam Technologies, a leading UI/UX design and development company that specializes in creating stunning websites and software solutions for businesses and institutes. We have a special offer for coaching institutes like yours. We can create a landing website for you with a starting price of just ₹3500. It will include a responsive design, a user-friendly interface, and all the essential features that you need to showcase your coaching center. We can also create custom websites based on your specific requirements and preferences.

But hurry, this offer is valid only for a limited time. Don't miss this chance to boost your online presence and reputation. Reply with yes and let's build a beautiful website for your institute. Trust us, you won't regret it. 😊`

const client = new Client({
  authStrategy: new LocalAuth()
});


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});


client.on('ready', async () => {
    console.log('Client is ready!');
    
    const phoneNumbers = csvToArray('./public/filtered_data2.csv');
    
    try {
        await Promise.all(phoneNumbers.map(async (phoneNumber) => {
            await verifyAndSendAsync(phoneNumber);
            console.log(`Message sent to ${phoneNumber}`);
        }));
        
        console.log('All messages sent successfully.');
    } catch (error) {
        console.error('Error sending messages:', error);
    }
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
const verifyAndSendAsync = async (number) => {
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
        client.sendMessage(number_details._serialized , media, {
          caption : CAPTION
        });
    }
})  
}




client.initialize();
