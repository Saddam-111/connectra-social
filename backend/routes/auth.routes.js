import express from 'express'
import {  resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp, } from '../controllers/auth.controllers.js'

export const authRouter = express.Router()




authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.post('/signout',signOut)



authRouter.post('/sendOtp', sendOtp)
authRouter.post('/resetPassword', resetPassword)
authRouter.post('/verifyOtp', verifyOtp)