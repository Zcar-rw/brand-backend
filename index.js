const express = require('express')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Welcome to your ride companion (Reach)')
})

// Middleware for handling not found routes
app.use((req, res, next)=>{
    res.send('Page Not Found')
})

app.listen(port, ()=>{
    
    console.log(`Production is listening on http://localhost:${port} `)
})