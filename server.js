
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3030

const bugService = require('./services/bug.service')

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
// app.get('/', (req, res) => res.send('Hello!'))

app.get('/api/bug', (req, res) => {
    // console.log('req.query', req.query)
    const sortBy = {
        by: req.query.by || 'title',
        desc: +req.query.desc || 1
    }

    const filterby = {
        title: req.query.title || '',
        page: +req.query.page || 0,
        createdAt: req.query.createdAt || 1,
        severity: req.query.severity || 1,
        labels: req.query.labels || null
    }


    // console.log('filterby.severity', filterby)
    bugService.query(filterby, sortBy)
        .then(results => {
            res.send(results)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load bugs')
        })
})
app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title, severity, description } = req.body
    const bug = { _id, title, severity, description }
    bugService.save(bug)
        .then(savedbug => {
            res.send(savedbug)
        })
        .catch(err => {
            console.log('Cannot save bug, Error:', err)
            res.status(400).send('Cannot save bug')
        })
})
app.post('/api/bug', (req, res) => {
    const { title, severity, description } = req.body
    const bug = { title, severity, description }
    bugService.save(bug)
        .then(savedbug => {
            res.send(savedbug)
        })
        .catch(err => {
            console.log('Cannot save bug, Error:', err)
            res.status(400).send('Cannot save bug')
        })
})


app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    var visitedBugIds = req.cookies.visitedBugIds || []
    console.log('visitedBugIds', visitedBugIds)
    if (visitedBugIds >= 3) return res.status(401).send('wait for a bit')
    if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
    res.cookie('visitedBugIds', visitedBugIds, { maxAge: 7000 })
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
            res.send('Bug Deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.listen(port, () => {
    console.log(`BugApp listening on: http://127.0.0.1:${port}`)
})

// Users

app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load users')
        })

})

app.put('/api/user/:userId', (req, res) => {
    const { _id, username, fullname, password } = req.body
    const user = { _id, username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.post('/api/user', (req, res) => {
    const { username, fullname, password } = req.body
    const user = { username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove user')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})