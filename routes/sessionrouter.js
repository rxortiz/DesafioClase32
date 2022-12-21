import express from "express"
import session from "express-session"
import path from 'path'
import MongoStore from 'connect-mongo'
import mongoose from "mongoose"
import User from "../containers/ContainerUsersMongoDbAtlas.js"
import passport from "passport"
import { webAuth } from "../lib/Common.js"
import {uri} from '../config/optionsmongodbatlas.js'
import {inventory} from "../routes/inventoryrouterfake.js" 
import cors from 'cors'
import cookieParser from "cookie-parser"
import bCrypt from "bcrypt"
import UserModel from "../models/User.js"
import { Strategy } from "passport-local"
import sessionFileStore from 'session-file-store'
import bodyParser from "body-parser"

let FileStore = sessionFileStore(session)
const folderPath = './sessions'

const localStrategy = Strategy

const router = express.Router()

// const urlencodedParser = bodyParser.urlencoded({ extended: false })

const usuario = new User()
router.use(cors())
router.use(express.json())
// router.use(express.urlencoded({ extended: true }))
// router.use(cookieParser())
// router.use(passport.initialize())
// router.use(passport.session())
// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({extended: true}))
/*
router.use(session({
	store: MongoStore.create({
	  mongoUrl:"mongodb+srv://ecommerce:ecommerce123@clustercursocoderhouse.n2h5tcv.mongodb.net/ecommerceDb?retryWrites=true&w=majority"
	  // ,mongoOptions: advancedOptions
	}),
	key: 'currentSession',
	secret: process.env.SESSION_SECRET || "secreto",
	cookie: { 
	  maxAge: 1000 * 60 * 10, // 10 minutos
	 }, 
	resave: false,
	saveUninitialized: false,
  }))

  passport.use(
	"register",
	new localStrategy(
		{ passReqToCallback: true },
		async (req, username, password, done) => {
			console.log("register", username + password)
			await mongoose.connect(uri)
			
			try {
				console.log(req.body.name ,
					req.body.lastName,
					username,
					req.body.email,
					createHash(password))

				UserModel.create(
					{
						username,
						password: createHash(password),
						email: req.body.email,
						name:req.body.name ,
						lastName: req.body.lastName			
					},
					(err, userWithId) => {
						if (err) {
							console.log(err)
							return done(err, null)
						}
						return done(null, userWithId)
					}
				)
			} catch (e) {
				return done(e, null)
			}
		}
	)
)

passport.use(
	"login",
	new localStrategy(async (username, password, done) => {
		await mongoose.connect(uri)
		try {
			// await UserModel.init().then(

			UserModel.findOne({username},
				(err, username) => {
					if (err) {
						return done(err, null)
					}

					if (!username){
						console.log('User not found with username ' + username)
						return done(null, false)
					}

					if(!isValidPassword(username, password)){
						console.log('Invalid password')
						return done(null, false)
					}

					return done(null, username)
				}
			)
			// )
		} catch (e) {
			console.error(`User login error: ${e}`)
			return done(e, null)
		}
	})
)

passport.serializeUser((user, done) => {
	// console.log(user)
	done(null, user._id)
})
  
passport.deserializeUser((id, done) => {
	UserModel.findById(id, done)
})


function createHash(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

function isValidPassword(user, password) {
	return bCrypt.compareSync(password, user.password)
}
*/

router.post("/login", async (req, res) => {
	const userArr = await usuario.listUsers()
	const userValido = await userArr.find((user) => user.username === req.body.username && user.password === req.body.password)
	
	try {
	  if (userValido) {
		req.session.contador = 1
		req.session.name = req.body.username
		req.session.status = "success"
		console.log(req.session.name)
		req.session.save(() => {
		  console.log(req.session)
		  res.status(200).send(req.session)
		})
	  } else {
		req.session.contador++
		res.send(req.session)
	  }
	} catch (e) {
	  res.status(500).json({ status: 'error', message: 'Login error' })
	}
  })

  router.get('/logout', (req, res) => {
    try {
      res.clearCookie('currentSession')
      req.session.destroy()
      res.status(200).json({
        status: 'success',
        message: 'Session closed',
      })
    } catch (e) {
        res.status(500).json({ status: 'error', message: 'Logout error' })
    }
})

router.get("/user", (req, res) => {
  res.status(200).json({name:req.session.name})
})

router.post("/register", passport.authenticate('register', {
  successRedirect: '/api/',
  failureRedirect: '/api/register'
}))



/*












router.get("/", (req, res) => {
	res.redirect("login")
})

router.get("/login", (req, res) => {
	res.render("login")
})

router.post(
	"/login",
	passport.authenticate("login", {
		// successRedirect: "/data",
		failureRedirect: "/loginerror"
	}), function (req, res) {
        res.render('data', { username: req.body.username, email: req.body.email})
		// res.redirect("data")
    }
)

router.get("/loginerror", (req, res) => {
	res.render("loginerror")
})

router.get("/register", (req, res) => {
	res.render("register")
})

router.get("/data", (req, res) => {
	// res.json({mensaje: 'Session started'})
	console.log("en el data")
	console.log(req.body.username)
	console.log(req.body.email)
	res.render("data")
})

router.post(
	"/register",
	passport.authenticate("register", {
		successRedirect: "/login",
		failureRedirect: "/loginerror",
	})
)

router.get("/logout",  function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err)
        } else {
        res.render('logout', { username: req.body.username })
    }
    })
})

*/

export default router
