import express from "express"
import {POKEMON} from "./pokelist.js"
import logger from "./logger.js"

const app = express()

app.use(express.json())
app.use(logger)

app.get("/:id", (req, res) => {
    const reqId = parseInt(req.params.id)
    const pokemon = POKEMON.find(p => p.id === reqId)
    if (pokemon) res.send(pokemon)
    else res.status(404).send({ msg: "No pokemon with the id of " + reqId })
})

app.listen(3000, () => console.log("Server running on port 3000"))