import express from "express"
import routerCart from "./routes/cartsrouter.js"
import routerInventory from "./routes/inventoryrouter.js"
import routerMessageCenter from "./routes/messagecenterrouter.js"
import routerSession from "./routes/sessionrouter.js"
import routerInfo from "./routes/inforouter.js"
import routerRandomNums from "./routes/randomnumsrouter.js"
import cors from 'cors'

import hbs from "express-handlebars"

import dotenv from 'dotenv'

import parseArgs from 'minimist'

import { LogginServerEcommerce } from "./lib/Common.js"

LogginServerEcommerce.setLevels()

dotenv.config()
// console.log(process.env.MONGODBCLOUD)
// console.log(process.argv.slice(2))
const args = parseArgs(process.argv.slice(2), {default: {PORT: '8080'}})
// console.log(args.PORT)
const PORT = args.PORT
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.use(express.static("../public"))
app.use("/api/productos", routerInventory)
app.use("/api/carritos", routerCart)
app.use("/api/mensajes", routerMessageCenter)
app.use("/api", routerSession)
app.use("/", routerSession)
app.use("/info", routerInfo)
app.use("/api/randoms", routerRandomNums)
app.use((req, res, next)=>{
	LogginServerEcommerce.logInfo(`Ruta: ${req.url}, metodo: ${req.method}`)
	next()
})
app.use('*', (req,res)=>{
	LogginServerEcommerce.logWarn('Ruta incorrecta: ' + req.url)
	res.send('ruta incorrecta')
})
app.use(cors())

// const PORT = process.env.port || 8080

/* app.set("views", "./src/views")

app.engine(
	".hbs",
	hbs.engine({
		defaultLayout: "main",
		layoutsDir: "./src/views/layouts",
		extname: ".hbs",
	})
)
app.set("view engine", ".hbs") */

const server = app.listen(PORT, () => {
	console.log(`Http server started on port ${server.address().port}`)
})
server.on("error", (error) => console.log(`Error in server ${error}`))
