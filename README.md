# Secrets

This project is a web application that allows users to register, log in, and view confidential information (secrets). It focuses on implementing authentication and security practices. The app is currently at **Level 6 Authentication**, utilizing **Google OAuth 2.0** with Passport.js for user authentication, as well as session management.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript Templating)
- Mongoose-encryption
- dotenv
- md5
- bcrypt
- Passport.js
- express-session
- passport-local-mongoose
- mongoose-findorcreate
- Google OAuth 2.0

## Features

- **User Registration**: Allows new users to register by providing their email and password.
- **User Login**: Registered users can log in using their credentials.
- **Secrets Page**: After logging in, users can view the secrets page.
- **Password Security**: User passwords are securely stored in the database using hashing and encryption techniques.
- **OAuth 2.0 with Google**: Users can log in with their Google account using OAuth 2.0.
- **Session Management**: Uses sessions for maintaining authentication status across routes.
- **Submit Secrets**: Authenticated users can submit their own secrets to the app.
- **Salting and Hashing**: Ensures passwords are salted and hashed before storing in the database.

## Levels of Authentication

### Level 1: Plaintext Password Storage
In this basic level, user passwords are stored in the database in plain text. This is highly insecure and should not be used in production.

### Level 2: Password Encryption Using `mongoose-encryption`
In this level, passwords are encrypted before being saved in the database. This protects the passwords in case the database is compromised.

### Level 3: Hashing Password using `md5`
At this level, passwords are hashed using md5 before being stored. Hashing is a one-way function, but md5 is outdated and vulnerable to attacks.

### Level 4: Salting and Hashing Password with `bcrypt`
At this level, the app uses bcrypt to salt and hash passwords. Bcrypt is a more secure algorithm that makes it difficult for attackers to reverse the hash or use precomputed attack tables.

### Level 5: Authentication using `Passport.js`
In this level, the app uses Passport.js with a local strategy for authentication. It manages user sessions, allowing users to log in with a username and password.

### Level 6: Google OAuth 2.0 Authentication with Passport.js
At the highest level, Google OAuth 2.0 is integrated using Passport.js. Users can authenticate with their Google account, and the app either finds an existing user or creates a new one using findOrCreate.

## How to Run the Project

1. Clone the repository.
    ```bash
   git clone https://github.com/sabhisharma-ise/Secrets.git
   cd Secrets/
2. Install the necessary dependencies:
   ```bash
   npm install
3. Set up a .env file to store your secrets, including Google OAuth credentials:
    ```makefile
    MONGO_URI=mongodb://localhost:27017/userDB
    SECRET=yourSecretKey
    CLIENT_ID=yourGoogleOAuthClientID
    CLIENT_SECRET=yourGoogleOAuthClientSecret
    ```
    You can get your Google OAuth credentials from [Google Developer Console](https://console.cloud.google.com/apis/dashboard?project=secret-436105).

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