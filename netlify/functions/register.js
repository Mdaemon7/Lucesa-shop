import { neon } from '@netlify/neon';
import bcrypt from "bcryptjs";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  const { name, email, password } = JSON.parse(event.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword});
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registro exitoso" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

