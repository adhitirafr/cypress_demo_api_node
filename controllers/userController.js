import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

import db from "../configs/database.js";
import * as modelUser from "../models/user.js";

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
    const saltRounds = process.env.SALTROUNDS ? parseInt(process.env.SALTROUNDS, 10) : 13
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertData = {
      name,
      email,
      password: hashedPassword,
      created_at: new Date()
    };

    // Proceed with registration logic, e.g., create new user
    await modelUser.insert(db, insertData);

    return res.status(201).json({
      message: "201: Created. User registered successfully.",
    });
  } catch (error) {
    console.log("error: " + error)
    return res.status(500).json({
      message: "500: Internal Server Error. Failed register.",
    });
  }
}

export async function login(req, res) {
  try {
    // Check required fields: name, email
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "400: Bad Request. 'email' and 'password' are required.",
      });
    }

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

    const expiresIn = "2h"; // Token expiration time (e.g., 1 hour)

    // Generate and send JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, type: "supporter" },
      process.env.SECRET_KEY,
      { expiresIn }
    );

    // If login is successful, you can return user data or a token
    return res.status(200).json({
      message: "200: OK. Login successful.",
      data: { 
        user,
        token: accessToken
    }, // You can include any other necessary user data here
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "500: Internal Server Error. Failed login.",
    });
  }
}
