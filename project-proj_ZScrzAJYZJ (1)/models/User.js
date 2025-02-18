const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create({ email, password, fullName }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (email, password_hash, full_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, full_name, created_at
        `;
        
        const values = [email, hashedPassword, fullName];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static async createSession(userId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days

        const query = `
            INSERT INTO sessions (user_id, session_token, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, session_token, expires_at
        `;
        
        const result = await db.query(query, [userId, token, expiresAt]);
        return result.rows[0];
    }
}

module.exports = User; 