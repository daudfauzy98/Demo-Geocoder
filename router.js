import express from 'express'
import nodeGeocoder from 'node-geocoder'
import fs from 'fs'

const router = express.Router()
// Setting parameter option untuk menggunakan provider map
const options = {
   provider: 'openstreetmap'
}
const geoCoder = nodeGeocoder(options)

// Menampilkan nama lokasi dan status ancaman banjir dari koordinat yang dimasukkan
router.get('/location', async (req, res) => {
   const latitude = req.query.lat
   const longitude = req.query.lon
   
   // Cari lokasi berdasarkan koordinat
   const location = await geoCoder.reverse({ lat: latitude, lon: longitude })

   // Jika lokasi ada
   if(location)  {
      // Fungsi untuk membaca file json
      const getJsonFile = (filePath, encoding = 'utf8') => (
         new Promise((resolve, reject) => {
            fs.readFile(filePath, encoding, (err, contents) => {
                if(err) {
                   return reject(err);
                }
                resolve(contents);
            });
         })
           .then(JSON.parse)
      )
      // Baca file JSON (key: nama kelurahan, value: status ancaman banjir)
      const dataJogja = await getJsonFile('./jogja.json')
      var kelurahanArray = []
      
      // Ambil nama kelurahan saja
      for (var i in dataJogja)
         kelurahanArray.push(i)

      // Mapping untuk mengambil atribut nama lokasi dan status
      const locationName = location.map(item => {
         const container = {}
         
         // Buat atribut formattedAddress dari string menjadi array
         var addressSplit = item.formattedAddress.split(',')
         for(var i=0; i<addressSplit.length; i++)
            addressSplit[i] = addressSplit[i].trim()
         
         // Cocokkan dengan variabel daftar kelurahan untuk mengambil nama kelurahannya saja
         const kelurahan = addressSplit.filter(element => 
            kelurahanArray.includes(element))
         
         // Jika kelurahan tidak cocok dengan daftar kelurahan yang ada
         if(!kelurahan)
            container.location = 'Tidak ada nama Kelurahan yang cocok'
         else {
            container.location = kelurahan[0]
            container.status = dataJogja[kelurahan]
         }

         return container
      })
      // Tampilkan nama lokasi dan status ancamannya
      res.status(200).json(locationName[0])   
   } else {
      // Jika lokasi tidak ada
      res.status(400).json({ message: 'Koordinat tidak dikenali !'})
   }
})

// Menampilkan koordinat latitude dan longitude dari suatu lokasi
router.get('/coordinate', async (req, res) => {
   // Cari koordinat berdasarkan lokasi
   const coordinate = await geoCoder.geocode(req.query.loc)

   // Jika koordinat dari lokasi ada
   if(coordinate)  {
      // Mapping untuk mengambil atribut latitude, longitude, dan alamat lengkap
      const locationCoordinate = coordinate.map(item => {
         const container = {}

         container.latitude = item.latitude
         container.longitude = item.longitude
         container.alamat_lengkap = item.formattedAddress

         return container
      })

      // Menampilkan koordinat latitude, longitude, dan alamat lengkap
      res.status(200).json(locationCoordinate)
   } else {
      // Jika koordinat lokasi tidak ada
      res.status(400).json({ message: 'Lokasi tidak dikenali !'})
   }
})

export default router