const express = require("express")
const path = require("path")
const fs = require("fs")

const PORT = 8080

const app = express()
const staticPath = path.join(__dirname, "../public")

app.use(express.static(staticPath))

const getJsonDataFromFile = (filePath, res) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err){
            return res.status(500).json({error: "Failed to read data from file"})
        }
        try{
            const jsonData = JSON.parse(data)
            res.json(jsonData)
        }
        catch(e){
            res.status(500).json({error: "Failed to parse json data"})
        }
    })
}

app.get("/artists", (_, res) => {
    const filePath = path.join(__dirname, "data/artists.json")

    getJsonDataFromFile(filePath, res)
})

app.get("/albums", (_, res) => {
    const filePath = path.join(__dirname, "data/albums.json")

    getJsonDataFromFile(filePath, res)
})

app.get("/charts", (_, res) => {
    const filePath = path.join(__dirname, "data/charts.json")

    getJsonDataFromFile(filePath, res)
})

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;