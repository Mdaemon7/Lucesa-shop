import { neon } from '@netlify/neon';
import bcrypt from "bcryptjs";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  const { email, password } = JSON.parse(event.body);

  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (result.length === 0) {
      return { statusCode: 401, body: "Usuario no encontrado" };
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return { statusCode: 401, body: "Contraseña incorrecta" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login exitoso",
        name: user.name,
        email: user.email
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
