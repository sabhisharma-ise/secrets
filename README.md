# Secrets

This project is a web application that allows users to register, log in, and view confidential information (secrets). It focuses on implementing authentication and security practices. Currently, the app is at **Level 4 Authentication**, which involves salting and hashing user passwords using bcrypt before saving them in the database.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript Templating)
- Mongoose-encryption
- dotenv
- md5
- bcrypt

## Features

- **User Registration**: Allows new users to register by providing their email and password.
- **User Login**: Registered users can log in using their credentials.
- **Secrets Page**: After logging in, users can view the secrets page.
- **Hashing & Encryption**: User passwords are securely stored in the database using hashing and encryption techniques.

## Levels of Authentication

### Level 1: Plaintext Password Storage
In this basic level, the user's password is stored in the database in plain text. While functional, this approach is insecure as it exposes sensitive information.

### Level 2: Password Encryption Using `mongoose-encryption`
At this level, passwords are encrypted using the `mongoose-encryption` package before being saved to the database. This ensures that even if the database is compromised, the passwords are not directly accessible. The passwords are automatically decrypted when querying for users.

### Level 3: Hashing Password using `md5`
At this level, instead of storing passwords as plaintext or encrypted text, we use the `md5` hashing algorithm to hash the password before saving it in the database.

- **Hashing**: Unlike encryption, hashing is a one-way function, meaning the original password cannot be retrieved from the hashed value.
- **MD5**: `md5` is a widely used hashing function that generates a 128-bit hash value. When a user registers or logs in, the password they provide is hashed using `md5`, and only the hashed value is stored in the database.

    #### Why MD5?
    MD5 is easy to implement and provides a simple layer of security for password storage. However, it has vulnerabilities to attacks like rainbow table attacks. In future versions, more secure hashing algorithms (like `bcrypt`) will be implemented to provide stronger security.

### Level 4: Salting and Hashing Password with `bcrypt`
At this level, we use `bcrypt` to hash passwords with salting. `bcrypt` is a slow hashing algorithm designed to make brute-force attacks and rainbow table attacks computationally expensive.

- **Salting**: A random string (called salt) is added to the password before hashing. This ensures that even if two users have the same password, they will have different hashes in the database.
- **Hashing**: After adding the salt, the password is hashed using the `bcrypt` algorithm. Bcrypt allows setting the "work factor" (the number of hashing rounds), making it adaptable to different security requirements.
  
  #### Why Bcrypt?
  Bcrypt is widely used because of its ability to adjust hashing rounds, providing greater security over time as computational power increases. Unlike MD5, `bcrypt` generates unique hashes even for identical inputs by introducing a salt.

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