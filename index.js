import express from 'express'
import router from './router.js'

// Membuat objek app dari kelas express()
const app = express()

// Middleware
// Menggunakan format JSON sebagai media pertukaran data
app.use(express.json())

// Testing endpoint untuk file index.js
app.get('/', (req, res) => {
   res.json({ message: 'Sukses terhubung!'})
})

// Endpoint routing ke file router.js
app.use('/api', router)

// Port API yang digunakan
app.listen(8000, () => {
   console.log('App listen on port 8000')
})