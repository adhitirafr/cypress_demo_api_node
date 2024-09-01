import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import db from "../configs/database.js";
import * as modelUser from "../models/user.js";
import { convertExpiresInToMs } from "../utils/conver_time.js";

const EXPIRED_TOKEN_TIME = "2h";

export async function register(req, res) {
  try {
    // Check required fields: name, email
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "400: Bad Request. 'name' and 'email' and 'password' are required.",
      });
    }

    // Check if the email is unique
    const existingUser = await modelUser.getByEmail(db, email);

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({
        message: "409: Conflict. Email already exists.",
      });
    }

    // Hash the password using bcryptjs with a salt round of 13
    const saltRounds = process.env.SALTROUNDS
      ? parseInt(process.env.SALTROUNDS, 10)
      : 13;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertData = {
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    };

    // Proceed with registration logic, e.g., create new user
    await modelUser.insert(db, insertData);

    return res.status(201).json({
      message: "201: Created. User registered successfully.",
    });
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({
      message: "500: Internal Server Error. Failed register.",
    });
  }
}

export async function login(req, res) {
  try {
    // Check required fields: name, email
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "400: Bad Request. 'email' and 'password' are required.",
      });
    }

    // Trim and sanitize inputs
    email = validator.trim(email);
    email = validator.escape(email); // This will sanitize input to prevent XSS attacks
    password = validator.trim(password);
    password = validator.escape(password);

    // get user by email
    let user = await modelUser.getByEmail(db, email);

    if (!user || user.length == 0) {
      return res.status(404).json({
        message: "Incorrect email or password",
      });
    }

    user = user[0];

    // Check password with bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const expiresIn = EXPIRED_TOKEN_TIME; // This can be dynamically set, like "2h", "7d", "30d", etc.
    const tokenExpirationMs = convertExpiresInToMs(expiresIn); // Convert to milliseconds dynamically

    // Generate and send JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn }
    );

    // Set HttpOnly cookie with the token
    res.cookie("authToken", accessToken, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: false, //process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      sameSite: "Lax", // Helps protect against CSRF attacks
      maxAge: tokenExpirationMs !== null ? tokenExpirationMs : undefined, // 2 hours in milliseconds
      path: "/", // Cookie is accessible throughout the site
    });

    // If login is successful, you can return user data or a token
    return res.status(200).json({
      message: "200: OK. Login successful.",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "500: Internal Server Error. Failed login.",
    });
  }
}

export function logout(req, res) {
  // Clear the authToken cookie
  res.cookie("authToken", "", {
    httpOnly: true, // Keep it HttpOnly for security
    secure: process.env.NODE_ENV === "production", // Ensure it's secure in production
    sameSite: "Lax", // Use the same settings as when setting the cookie
    expires: new Date(0), // Set the expiration date to the past
    path: "/", // Ensure the path matches the one used when setting the cookie
  });

  // Optionally, send a response to the client
  res.status(200).json({
    message: "Successfully logged out",
  });
}
