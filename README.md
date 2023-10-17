# Dating App Backend Server

This repository hosts the backend server for the Dating App, a RESTful API designed to support the [Dating App Admin Site](https://dating-app-admin-site.netlify.app/).

The codebase follows a feature-centric pattern, where each feature has its dedicated model, router, and controller. Additionally, a socket server is integrated at the path `/socket` for dating app, implemented using Object-Oriented Programming (OOP) principles.

Written in JavaScript, utilizing technologies such as Express.js for creating RESTful APIs, Swagger for documentation, Mongoose/Mongodb, multer & S3 for storing data & images, bcrypt & jwt for encrypting password & creating session token and socket.io for socket server, among others.

## Documentation

Detailed API documentation can be found [here](https://dating-app-server-gdjw.onrender.com/docs).

## Usage

1. Clone the repository:
   git clone https://github.com/Vinayak1337/levtours.server.git
   
2. Install the dependencies:
   cd levtours.server
   npm install
   
3. Start the server:
   npm start

## License

This project is under the [MIT License](https://github.com/Vinayak1337/dating-app.server/blob/master/LICENSE.md). Feel free to fork and use this repository, ensuring you adhere to the license terms.
