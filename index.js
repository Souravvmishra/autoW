const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const csvToArray = require('./csvToArray');
const locateChrome = require('locate-chrome');
const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));


const CAPTION = ` *Important Announcement for Coaching Centers in India* 

 *Update from the Education Ministry: New Rules in Effect*

 The Education Ministry now mandates all coaching centers to have a website showcasing tutors, courses, fees, and facilities. Failure to comply may result in hefty fines or registration loss.

 *Seize the Opportunity to Shine Online!*

 Ensure your coaching center stands out! We're here to help you with an incredible offer.

 *Who We Are:* Codestam Technologies (www.codestam.com)

✨ *Our Offer:* Affordable landing website for your coaching center, starting at just ₹3500. We also specialize in custom websites/software development.

‍♂ *Limited Time Offer - Act Now!*

 Reply with 'Yes' to elevate your institute's online presence. Let's create a stunning website that attracts more students and enhances your reputation. Trust us, you'll love it! `;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: executablePath
  }
});


client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});


client.on('ready', async () => {
  console.log('Client is ready!');

  // const phoneNumbers = csvToArray('./public/test.csv');

  // const sendWithDelay = async (phoneNumber) => {
  //   try {
  //     await verifyAndSendAsync(phoneNumber);
  //     console.log(`Successfully sent message to ${phoneNumber}`);
  //   } catch (error) {
  //     console.error(`Error sending message to ${phoneNumber}:`, error);
  //   } finally {
  //     // Add a 5-second delay between messages
  //     await new Promise(resolve => setTimeout(resolve, 5000));
  //   }
  // };

  // for (const phoneNumber of phoneNumbers) {
  //   await sendWithDelay(phoneNumber);
  // }
});




// Function to verify user and send document
const verifyAndSendAsync = async (number) => {
  try {
    console.log(number + " is being verified...");
    sanitized_number = number.toString().replace(/\D/g, "");

    const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`;

    const number_details = await client.getNumberId(final_number);

    if (!number_details) {
      console.log(`${final_number} is not on whatsapp`);
      return;
    }

    client.isRegisteredUser(number_details._serialized).then(function (isRegistered) {
      if (isRegistered) {
        const media = MessageMedia.fromFilePath('./public/Ad001.mov'); // Change to whatever you have to send
        client.sendMessage(number_details._serialized, media, {
          caption: CAPTION
        });
      }
    });
    return true
  } catch (error) {
    console.log(error);
    throw error
  }
};

// client.initialize();

module.exports =  { client, verifyAndSendAsync }
