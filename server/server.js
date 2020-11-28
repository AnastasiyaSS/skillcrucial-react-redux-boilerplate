import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import axios from 'axios'
import config from './config'
import Html from '../client/html'

const { default: Root } = require('../dist/assets/js/ssr/root.bundle')

let connections = []

const headers = (req, res, next) => {
  res.set('x-skillcrucial-user', '634be23a-9ad6-479b-9f8b-275d8806fc6d')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
}

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  headers,
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const saveFile = async (users) => {
  await writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" });
}

const readWrite = () => {
  return readFile(`${__dirname}/users.json`, { encoding: "utf8" })
    .then(it => JSON.parse(it))
    .catch(async() => {
      const users = await axios('https://jsonplaceholder.typicode.com/users').then(link =>link.data)
      writeFile(`${__dirname}/users.json`, JSON.stringify(users), { encoding: "utf8" })
      return users
    })
}

server.get('/api/v1/users', async (req, res) => {
  const users = await readWrite()
  res.json(users)
})

 server.post('/api/v1/users', async (req, res) => {
  const newUser = req.body
  const users = await readWrite()
  const newUserId = users[users.length - 1].id + 1
  const newListOfUsers = [ ...users, { ...newUser, id: newUserId }]
  saveFile(newListOfUsers)
  res.json({ status: 'success', id: newUserId })
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const users = await readWrite()
  const userSearch = users.find(item => item.id === +userId)
  const newFields = { ...userSearch, ...req.body }
  const list = users.reduce((acc, rec) => {
    return rec.id === +userId ? [...acc, newFields] : [ ...acc, rec ]
  },[])
  saveFile(list)
  res.json({status: 'success', id: userId})
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const users = await readWrite()
  const filterUser = users.filter(it => it.id !== +userId)
  saveFile(filterUser)
  res.json({status: 'success', id: userId})
})

server.delete('/api/v1/users', (req, res) => {
  const users = unlink(`${__dirname}/users.json`)
  res.json(users)
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => { })

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
