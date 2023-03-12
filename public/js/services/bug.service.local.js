import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query() {
  return storageService.query(STORAGE_KEY)
}

function getById(bugId) {
  return storageService.get(STORAGE_KEY, bugId)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug)
  }
  return storageService.post(STORAGE_KEY, bug)
}
