const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt")
const {open} = require("sqlite");
const sqlite3 = require("sqlite3")
const jwt = require("jsonwebtoken")
const app = express()
app.use(express.json())
const cors = require("cors");

// Configure CORS
app.use(cors({
    origin: "http://localhost:3001",  // Allow only frontend origin
    credentials: true,  // Allow cookies and authentication headers
}));



const dbpath = path.join(__dirname, "backend.db");

let db = null;

const initialization = async () => {
    try{
        db = await open({
            filename:dbpath,
            driver: sqlite3.Database
        })
        const count = await db.get("SELECT COUNT(*) as count FROM dashboard_cards");

        if (count.count === 0) {
            await db.run(`
                INSERT INTO dashboard_cards (title, description) VALUES
                ('New Delhi Overview', 'Explore the heart of India, its history, and culture.'),
                ('India Gate', 'Discover the iconic war memorial in New Delhi.'),
                ('Red Fort', 'A UNESCO World Heritage Site and a symbol of India’s history.');
            `);
        }
        app.listen(3000, ()=> {
            console.log("server running on 3000 port")
        })
    }catch(e){
        console.log(`error occurs in db: ${e.message}`)
        process.exit(1)

    }

}
initialization()

//userRegister
app.post("/users/register", async (request,response) => {
    const {username,password,} = request.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const userQuery = `
    SELECT * FROM users WHERE username = '${username}';
    `;
    const dbUser = await db.get(userQuery);
    if (dbUser === undefined){
        //create user in userdetails
        const createQuery = `
        INSERT INTO users (username,password) VALUES ('${username}','${hashedPassword}');
        `;
        await db.run(createQuery)
        response.status(201).json({ message: "User created successfully" });
    } 
    else{

  // handle user error
    response.status(400)
    response.send("user id already created")
    }
})

//login user 
app.post("/users/login", async (request,response) => {
    const {username,password} = request.body;
    const userQuery = `
    SELECT * FROM users WHERE username = '${username}';
    `;
    const dbUser = await db.get(userQuery);
    console.log(dbUser)
    if (dbUser === undefined){
        return response.status(400).send("Invalid user loginn");
       
    }else{
  const isPasswordMatched = await bcrypt.compare(password,dbUser.password)
 
  if (isPasswordMatched === true){
    const playload = {id: dbUser.id};
  
    const jwtToken = jwt.sign(playload,'back');
   
    response.json({ token: jwtToken });

  }else{
    return response.status(400).send("Invalid password");
  }
    
    }
})

// authentication user 

const actunticationjwtToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        return response.status(401).send("User unauthorized");
    } else {
        jwt.verify(jwtToken,'back', async (error, payload) => {
           
            if (error) {
                console.log(" JWT Verification Error:", error.message);
                
                return response.status(401).json({ error: "Invalid access token" });
            } else {
                // Log the payload to ensure it contains the user ID
                console.log("Decoded payload: ", payload);
                
                if (!payload || !payload.id) {
                    return response.status(400).send("User ID is missing. Authentication failed.");
                }
                console.log("Decoded Payload:", payload); // Log payload
                request.userId = payload.id; 
                
                console.log("User ID: ", request.userId);  // Log to verify the userId
                next();
            }
        });
    }
};

// Backend (Node.js + Express)
app.get("/users/dashboard", actunticationjwtToken, async (req, res) => {
    try {
        const userId = req.userId; ; // Extracted from JWT token
      console.log("idddd:",userId)
      const user = await db.get("SELECT username FROM users WHERE id = ?", [userId]);
      console.log(user)
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Fetch dashboard data (modify as needed)
      const dashboardData = await db.all("SELECT id, title, description FROM dashboard_cards");
  
      res.json({
        username: user.username, // Send the username
         cards: dashboardData,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// Map API
// app.get('/users/map', actunticationjwtToken, (req, res) => {
//     res.json({
//         locations: [
//             { title: "New Delhi Overview", coords: [28.6139, 77.2090] },
//             { title: "India Gate", coords: [28.6129, 77.2295] },
//             { title: "Red Fort", coords: [28.6562, 77.2410] }
//         ],
//         center: [28.6139, 77.2090], // Centered around New Delhi
//         zoom: 12
//     });
// });

app.get('/users/map', actunticationjwtToken, (req, res) => {
    res.json({ center: [20.5937, 78.9629], zoom: 5 });
});

// app.listen(3000, () => console.log(`Server running on port ${3000}`));