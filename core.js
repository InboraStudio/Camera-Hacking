const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

app.post('/upload', (req, res) => {
    const imageData = req.body.image;

    // Extract the base64 data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    // Convert the base64 string to a buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Email configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'admin-email@example.com',
        subject: 'Photo from user',
        text: 'Here is the photo captured by the user.',
        attachments: [
            {
                filename: 'photo.png',
                content: imageBuffer
            }
        ]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Error sending email' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ success: true, message: 'Email sent successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
