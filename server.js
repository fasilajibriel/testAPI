const {Client} = require("pg");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
    "user": "ymbzcndy",
    "password": "w9h188N8JHD-mHLQKXNnIHcWjitlvkKX",
    "host": "suleiman.db.elephantsql.com",
    "port": 5432,
    "database": "ymbzcndy"
});

// Home
app.get("/", (req, res) => res.sendFile(`${__dirname}/index/index.html`));

// Users
app.post("/api/users/get", async (req, res) => {
    let result = [];
    try {
        if (req.body.phone === undefined && req.body.password === undefined) {
            let queryResult = await getUser();
            result.push(queryResult);
        } else {
            const reqJson = req.body;
            let queryResult = await authUser(reqJson.phone, reqJson.password);
            result.push(queryResult);
        }
    } catch (e) {
        result.push({success: false});
        console.log(result)
    } finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result))
    }
});
async function authUser(phone, password) {
    try {
        const results = await client.query("SELECT * FROM users WHERE phone_number = $1 and password = $2", [phone, password]);
        return results.rows[0];
    } catch (e) {
        return [];
    }
}
async function getUser() {
    try {
        const results = await client.query("SELECT * FROM users");
        return results.rows[0];
    } catch (e) {
        return [];
    }
}

/*app.listen(8000, () => {
    console.log(`server running on port 8000`)
});*/

app.listen(process.env.PORT || 5000);

start();

async function start() {
    await connect();
}

async function connect() {
    try {
        await client.connect();
    } catch (e) {
        console.error(`Failed to connect ${e}`)
    }
}
