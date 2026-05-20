import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './utils/db'
import authRoutes from './routes/authRoutes'
import { errorHandler, notFound } from './middleware/errorHandler'

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

// Routes
app.use('/api/auth', authRoutes)
// Lead routes wired in Commit 3
// app.use('/api/leads', leadRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`)
    })
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })

export default app
