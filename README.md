# Secrets

This project is a web application that allows users to register, log in, and view confidential information (secrets). It focuses on implementing authentication and security practices. Currently, the app is at **Level 2 Authentication**, which involves encrypting user passwords in the database.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript Templating)
- Mongoose-encryption
- dotenv

## Features

- **User Registration**: Allows new users to register by providing their email and password.
- **User Login**: Registered users can log in using their credentials.
- **Secrets Page**: After logging in, users can view the secrets page.
- **Encryption**: User passwords are securely stored in the database using encryption.

## Levels of Authentication

### Level 1: Plaintext Password Storage
In this basic level, the user's password is stored in the database in plain text. While functional, this approach is insecure as it exposes sensitive information.

### Level 2: Password Encryption Using `mongoose-encryption`
At this level, passwords are encrypted using the `mongoose-encryption` package before being saved to the database. This ensures that even if the database is compromised, the passwords are not directly accessible. The passwords are automatically decrypted when querying for users.

## How to Run the Project

1. Clone the repository.
2. Install the necessary dependencies:
   ```bash
   npm install
3. Set up a .env file to store your encryption secret:
    ```makefile
    SECRET=yourSecretKey
4. Start your MongoDB server:
    ```bash
    mongod
5. Start the application:
    ```bash
    node app.js
6. The application will be running at:
    ```bash
    http://localhost:3000

## Folder Structure

- **/views**: Contains the EJS templates for different web pages.
    - home.ejs: Home page
    - login.ejs: Login page
    - register.ejs: Registration page
    - secrets.ejs: Page shown after successful login.
    - submit.ejs: Page where users can submit their secrets.
- **/public**: Static files (e.g., CSS).
    - **/css**: Contains styles.css for styling the web pages.
- **/views/partials**: Contains reusable parts like the header and footer (header.ejs, footer.ejs).