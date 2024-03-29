import { exec } from 'child_process'
import express from 'express'
import path from 'path'

require('dotenv').config({ path: '../.env' })

if (process.env.DEPLOYER_PORT === undefined) throw Error('Missing PORT environment variable')
const PORT = parseInt(process.env.DEPLOYER_PORT as string)
// only allow connections from localhost
const HOST = 'localhost'

const app = express()

interface BuildHookParams {
  event:
    | 'entry.create'
    | 'entry.update'
    | 'entry.delete'
    | 'entry.publish'
    | 'entry.unpublish'
    | 'media.create'
    | 'media.update'
    | 'media.delete'
  created_at: string
  model: string
  entry: any
}

let buildInProgress = false
let buildQueued = false

app.post<BuildHookParams>('/build_hook', (request, response) => {
  console.log(`/build_hook [${request.params.event} : ${request.params.model}]`)

  if (buildQueued) {
    console.log(`Build already queued, ignore build hook`)
    response.sendStatus(200)
  } else if (buildInProgress) {
    console.log(`Build in progress, queueing build when current one completes`)
    buildQueued = true
    response.sendStatus(200)
  } else {
    console.log(`Starting new build`)
    build()
    response.sendStatus(200)
  }
})

function build() {
  buildInProgress = true
  exec(`yarn reload`, { cwd: path.join(__dirname, '../../front') }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Export failed 😒: ${stderr}`)
    } else {
      console.log(`Export succeeded 👍: ${stdout}`)
    }
    buildInProgress = false
    if (buildQueued) {
      buildQueued = false
      console.log(`Starting queued build`)
      build()
    }
  })
}

app.listen(PORT, HOST, () => {
  console.log(`Deployer server listening on http://localhost:${PORT}`)
})
