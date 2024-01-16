const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const moment = require('moment')

const authService = require('../services/authService')
const userService = require('../services/userService')
const { webAuthenticate, checkIfUser, isModerator } = require('../middlewares/webAuthMiddleware')
const discService = require('../services/discussionService');
const replyService = require('../services/replyService')


const webRouter = express.Router();

// webRouter.use(express.static('public'));
webRouter.use(cookieParser())

webRouter.get('', async (req, res) => {
	return res.redirect('/home');
});

webRouter.use(checkIfUser)

webRouter.get('/home', async (req, res) => {
	try {
		let user  
		user = req.user

		const params = req.query
		const response = await discService.getDiscussions(params)
		if (response.status === 200) {
			return res.render('home', { data: response.data, message: response.message, user, moment })
		}
		return res.render('home')

	} catch (error) {
		res.redirect('/errorPage')
	}

})


webRouter.get('/signup', async (req, res) => {
	let message
	let user = req.user
	if (user) {
		return res.redirect('/home')
	}
	res.render('signup', { message, user })
})


webRouter.post('/signup', async (req, res) => {
	try {
		let user = req.user
		const userData = { email, username, password } = req.body

		const response = await userService.signup(userData)

		if (response.status === 409) {
			return res.render('signup', { message: response.message, user })
		} else if (response.status === 201) {
			return res.redirect('/home') //, { message: response.message }
		} else {
			return res.render('signup', { message: response.message, user })
		}
	} catch (error) {
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/login', async (req, res) => {
	let message
	let user = req.user
	if (user) {
		return res.redirect('/home')
	}
	res.render('login', { message, user })
})


webRouter.post('/login', async (req, res) => {
	try {
		let user = req.user
		const loginData = { email, password } = req.body
		console.log({ loginData })
		const response = await authService.login(loginData)

		if (response.status === 401) {
			return res.render('login', { message: response.message, user })
		} else if (response.status === 201) {
			res.cookie('jwt', response.token)
			return res.redirect('/home') //, { message: response.message }
		} else {
			return res.render('login', { message: response.message, user })
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, , { error: error }
	}
})



// discussion
webRouter.get('/discussion/:slugOrId', async (req, res) => {
	try {
		let user = req.user
		const response = await discService.getDiscussion(req.params.slugOrId)

		if (response.status === 200) {
			return res.render('discussion', { message: response.message, discussion: response.discussion, moment, user })
		} else {
			return res.redirect('/home')     //{ message: response.message, user }
		}
	} catch (error) {
		return res.redirect('/errorPage')
	}
})


webRouter.get('/errorPage', async (req, res) => {
	let message
	let user = req.user
	res.render('errorPage', { message, user })
})


webRouter.use(webAuthenticate)

webRouter.get('/create-discussion', async (req, res) => {
	try {
		let message
		let user = req.user
		return res.render('create-discussion', { message, user })
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.post('/create-discussion', async (req, res) => {
	try {
		let user = req.user

		const discData = { heading, description } = req.body
		const authorId = req.user._id

		const response = await discService.createDiscussion(authorId, discData)
		if (response.status === 201) {
			return res.redirect('/home')  // response.message
		} else {
			return res.render('create-discussion', { message: response.message, user })
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}

})


webRouter.get('/edit-discussion/:discussionId', async (req, res) => {
	try {
		let message
		let user = req.user

		const { discussionId } = req.params
		const userId = req.user._id

		const response = await discService.getMyDiscussion(userId, discussionId)

		if (response.status === 200) {
			return res.render('edit-discussion', { message: response.message, discussion: discussion, moment, user })
		} else {
			return res.redirect('my-discussion')	//, { message: response.message }
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.post('/edit-discussion/:discussionId', async (req, res) => {
	try {
		let user = req.user

		const { discussionId } = req.params
		const userId = req.user._id

		const updateData = { heading, description } = req.body

		const response = await discService.updateDiscussion(userId, discussionId, updateData)

		if (response.status === 200) {
			return res.redirect(`/my-discussions/${discussionId}`)	//{ message: response.message, discussion: discussion, moment }
		} else {
			return res.redirect('/my-discussion')	//, { message: response.message }
		}

	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.post('/discussion/:slugOrId/reply', async (req, res) => {
	try {
		let message
		let userId = req.user._id
		discussionId = req.params.slugOrId

		const replyData = { text: req.body.replyText }

		const response = await replyService.addReply(userId, discussionId, replyData)
		if (response.status === 201) {
			return res.redirect(`/discussion/${discussionId}`)	//{ message: response.message, discussion: discussion, moment }
		} else {
			return res.redirect('/home')	//, { message: response.message }
		}

	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}

})


webRouter.get('/logout', (req, res) => {
	try {
		res.clearCookie('jwt')
		res.redirect('/')
	} catch (error) {

		res.redirect('/errorPage')
	}
});


webRouter.use(isModerator)

webRouter.post('/discussion/:discId/delete', async (req, res) => {
	const discussionId = req.params.discId

	const response = await discService.adminDeleteDiscussion(discussionId)
	if (response.status === 200) {
		return res.redirect(`/home`)	//{ message: response.message, discussion: discussion, moment }
	} else {
		return res.redirect('/errorPage')	//, { message: response.message }
	}
})


webRouter.post('/reply/:replyId/delete', async (req, res) => {
	const replyId = req.params.replyId
	const response = await replyService.adminDeleteReply(replyId)
	if (response.status === 200) {
		return res.redirect(`/home`)
	} else {
		return res.redirect('/errorPage')	
	}
})


module.exports = webRouter;