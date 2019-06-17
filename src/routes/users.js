const express = require('express')
const router = express.Router()

// Require
const User = require('../models/User')
const passport = require('passport')

// SIGNUP
router.get('/users/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
    let errors = []
    const { name, email, password, confirm_password } = req.body
    if (name.length <= 0) {
        errors.push({text: 'Please insert your name.'})
    }
    if (password != confirm_password) {
      errors.push({text: 'Passwords do not match.'});
    }
    if (password.length < 3) {
      errors.push({text: 'Passwords must be at least 3 characters.'})
    }
    if (errors.length > 0) {
      res.render('users/signup', {errors, name, email, password, confirm_password})
    } else {
      // Look for the same email
      const sameEmail = await User.findOne({ email: email })
      if (sameEmail) {
        req.flash('error_msg', 'The Email is already in use!')
        res.redirect('/users/signup')
      } else {
        // Saving a New User
        const newUser = new User({ name, email, password })
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', 'You are registered!')
        res.redirect('/users/signin')
      }
    }
  })

// SIGNIN
router.get('/users/signin', (req, res) => {
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}))

// Logout
router.get('/users/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out now.')
  res.redirect('/users/signin')
})

module.exports = router