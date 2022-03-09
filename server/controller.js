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
                DROP TABLE IF EXISTS users;
                DROP TABLE IF EXISTS beats;

                CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    username VARCHAR(30) NOT NULL,
                    password VARCHAR(5000) NOT NULL
                );
                CREATE TABLE beats (
                    beat_id SERIAL PRIMARY KEY,
                    beat_name VARCHAR(25) NOT NULL,
                    beat_kit TEXT NOT NULL,
                    beat_notes JSON NOT NULL,
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
    },
    saveSong: (req, res) => {
        let json = JSON.stringify(req.body)
        sequelize
            .query(`
                INSERT INTO beats (beat_name, beat_kit, beat_notes, user_id)
                VALUES ('${req.body.beatName}', '${req.body.drumpack}', '${json}', '${req.body.user}');
            `)
            .then(dbRes => res.sendStatus(200))
            .catch(err => console.log(err))
        // console.log(req.body)
    },
    getUserInfo: (req, res) => {
        sequelize
            .query(`
                SELECT *
                FROM users
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    getUserBeats: (req, res) => {
        sequelize
            .query(`
                SELECT *
                FROM beats
                WHERE user_id = ${req.params.id}
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    getAllBeats: (req, res) => {
        sequelize
            .query(`
                SELECT *
                FROM beats
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    login: (req, res) => {
        console.log('Logging in user')
        console.log(req.body)
        sequelize
            .query(`
                SELECT * 
                FROM users
                WHERE username = '${req.body.user}' AND password = '${req.body.password}'
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    signUp: (req, res) => {
        console.log('hit')
        sequelize
            .query(`
                SELECT username FROM users WHERE username = '${req.body.user}'
            `)
            .then(dbRes => {
                console.log(dbRes[0])
                console.log(dbRes[0].length)
                if (dbRes[0].length === 0 ) {
                    sequelize
                        .query(`
                        INSERT INTO users (username, password)
                        VALUES ('${req.body.user}', '${req.body.password}')
                        `)
                        .then(res.sendStatus(200))
                        .catch(err => console.log(err))
                } else res.sendStatus(400)

            })
            .catch(err => console.log(err))
    }
}
