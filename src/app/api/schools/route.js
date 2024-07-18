import { writeFile } from "fs/promises";
import mysql from "mysql2/promise"; // Ensure you are using mysql2/promise
import { NextResponse } from "next/server";

// Function to convert formdata to json
function formDataToJSON(formData) {
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

const dbConfig = {
  host: "sql12.freesqldatabase.com",
  user: "sql12720251",
  password: "Jts3xfpKU8",
  database: "sql12720251",
  waitForConnections: true,
  connectionLimit: 10000,
  queueLimit: 0,
};

// Creating a pool connection
const pool = mysql.createPool(dbConfig);

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

// Handling POST requests
export async function POST(req, res) {
  let formData = await req.formData();
  const data = formDataToJSON(formData);

  // Image upload
  let connection;
  const file = data["image"];
  try {
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `C:/Development/Assignment-SchoolFormData/schooldata/public/schoolImages/${Date.now()}-${
      file.name
    }`;
    const imageString = `${Date.now()}-${file.name}`;
    console.log(imageString);
    await writeFile(path, buffer);

    // Database connection and query

    connection = await pool.getConnection(); // Getting a connection from the pool

    if (connection) console.log("Connected to database");

    const insertQuery = `
      INSERT INTO schooldata (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const { name, address, city, state, contact, email } = data;

    // Sending data to database
    const result = await connection.query(insertQuery, [
      name,
      address,
      city,
      state,
      contact,
      imageString,
      email,
    ]);
    console.log(result);
  } catch (error) {
    console.error("Database connection or query error:", error);
    return new Response("Error processing request", { status: 500 });
  } finally {
    if (connection) connection.release();
  }

  return new Response("Data successfully sent", { status: 200 });
}

// Handling GET requests
export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection(); // Getting a connection from the pool

    if (connection) console.log("Connected to database");

    const selectQuery = `
      SELECT * FROM schooldata
    `;

    // Fetching data from database
    const [rows] = await connection.query(selectQuery);
    console.log(rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database connection or query error:", error);
    return new Response("Error processing request", { status: 500 });
  } finally {
    if (connection) connection.release(); 
  }
}
