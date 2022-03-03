require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports ={
    seed: (req, res) => {
        sequelize
            .query(`
                DROP TABLE IF EXISTS USERS
                DROP TABLE IF EXISTS BEATS

                CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    username VARCHAR(30) NOT NULL,
                    password VARCHAR(5000) NOT NULL
                );
                CREATE TABLE beats (
                    beat_id SERIAL PRIMARY KEY,
                    beat_name VARCHAR(25) NOT NULL,
                    beat_kit TEXT NOT NULL,
                    beat_notes TEXT NOT NULL,
                    beat_times TEXT NOT NULL,
                    user_id INT REFERENCES users(user_id)
                );
                INSERT INTO users (username, password)
                VALUES ('Admin', 'Password');
            `)
            .then(() => {
                console.log('DB SEEDED!')
                res.sendStatus(200)
            })
            .catch(err => console.log('error seeding DB' , err))
    }
}
