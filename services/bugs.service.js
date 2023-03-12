const fs = require('fs')

const gBugs = require('../data/bugs.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

function query(filterBy = { title: '' }) {
  const regex = new RegExp(filterBy.title, 'i')
  const bugs = gBugs.filter(bug => regex.test(bug.title))
  console.log(bugs)
  return Promise.resolve(bugs)
}

function getById(bugId) {
  const bug = gBugs.find(bug => bug._id === bugId)
  if (!bug) return Promise.reject('Unknown bug')
  return Promise.resolve(bug)
}

function remove(bugId) {
  const idx = gBugs.findIndex(bug => bug._id === bugId)
  if (idx === -1) return Promise.reject('Unknown bug')

  gBugs.splice(idx, 1)
  return _saveBugsToFile()
}

function save(bug) {
  let savedBug
  if (bug._id) {
    savedBug = gBugs.find(currBug => currBug._id === bug._id)
    if (!savedBug) return Promise.reject('Unknown bug')
    savedBug.title = bug.title
    savedBug.description = bug.description
    savedBug.severity = bug.severity
    savedBug.createdAt = bug.createdAt
  } else {
    savedBug = {
      _id: _makeId(),
      title: bug.title,
      description: bug.description,
      severity: bug.severity,
      createdAt: Date.now(),
    }
    gBugs.push(savedBug)
  }
  return _saveBugsToFile().then(() => savedBug)
}

function _makeId(length = 5) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gBugs, null, 2)

    fs.writeFile('data/bugs.json', data, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}
