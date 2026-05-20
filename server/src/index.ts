import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
const PORT = process.env.PORT ?? 5000

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'GigFlow API is running' })
})

// Routes — wired in Commit 2 & 3
// app.use('/api/auth', authRoutes)
// app.use('/api/leads', leadRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`)
})

export default app
