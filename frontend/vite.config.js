import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defaultLimiter } from '../api/lib/rateLimiter.js'
import { streamCompletion } from '../api/lib/llm.js'

function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'healthy' }))
          return
        }

        if (req.url === '/api/chat' && req.method === 'POST') {
          let rawBody = ''
          req.on('data', chunk => { rawBody += chunk })
          req.on('end', async () => {
            try {
              const body = JSON.parse(rawBody || '{}')
              const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1').toString()
              const rateCheck = defaultLimiter.check(ip)
              if (!rateCheck.isAllowed) {
                res.statusCode = 429
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(rateCheck.body))
                return
              }

              const message = (body.message || '').trim()
              if (!message) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ detail: 'Message cannot be empty' }))
                return
              }

              res.writeHead(200, {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
              })

              const stream = streamCompletion(message, body.messages || [])
              for await (const chunk of stream) {
                res.write(chunk)
              }
              res.end()
            } catch (err) {
              console.error('Error in local API middleware:', err)
              if (!res.headersSent) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ detail: 'An error occurred' }))
              } else {
                res.end()
              }
            }
          })
          return
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
