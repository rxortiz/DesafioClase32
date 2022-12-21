import express from "express"
import cookieParser from 'cookie-parser'

const router = express.Router()
// router.use(cookieParser())
router.use(cookieParser('claveGustavo'))
/*
router.get("/set", (req, res) => {
	res.cookie("server", "express").send("cookie en el set")
})

router.get("/setEx", (req, res) => {
	res.cookie("server2", "express2", {maxAge: 30000}).send("cookie en el setEx")
})
*/

router.get("/firmadas", (req, res) => {
	res.send(req.signedCookies)
})

router.post("/firmadas", (req, res) => {
	const {nombre, valor, tiempo} = req.body
	if (!nombre || !valor) {
		res.json({error:"falta nombre o valor"})
	} else {
		if (tiempo) {
			res.cookie(nombre, valor, {maxAge:parseInt(tiempo), signed:true})
		} else{
			res.cookie(nombre, valor, {signed:true})
		}
		res.json({proceso:"ok"})
	}
})

router.delete("/firmadas", (req, res) =>{
	console.log(req.body.nombre)
	res.clearCookie(req.body.nombre).send("eliminada")
})

export default router
