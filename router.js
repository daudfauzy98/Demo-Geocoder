import express from 'express'
import nodeGeocoder from 'node-geocoder'
import fs from 'fs'

const router = express.Router()
const options = {
   provider: 'openstreetmap'
}
const geoCoder = nodeGeocoder(options)

router.get('/location', async (req, res) => {
   const latitude = req.query.lat
   const longitude = req.query.lon
   //const { latitude, longitude } = req.body

   const location = await geoCoder.reverse({ lat: latitude, lon: longitude })

   if(location)  {
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

      const dataJogja = await getJsonFile('./jogja.json')
      var kelurahanArray = []

      for (var i in dataJogja)
         kelurahanArray.push(i)

      // Coordinate Latitude and Longitude
      const locationName = location.map(item => {
         const container = {}
         
         //addressSplit.location = String(item.formattedAddress.split(',', 1))
         var addressSplit = item.formattedAddress.split(',')
         for(var i=0; i<addressSplit.length; i++)
            addressSplit[i] = addressSplit[i].trim()
         
         const kelurahan = addressSplit.filter(element => 
            kelurahanArray.includes(element))
         if(!kelurahan)
            container.location = 'Tidak ada nama Kelurahan yang cocok'
         else {
            container.location = kelurahan[0]
            container.status = dataJogja[kelurahan]
         }
         return container
      })
      
      res.status(200).json(locationName[0])
      //res.status(200).json({ message: 'Sukses meng-compile!', result:  })
   } else {
      res.status(400).json({ message: 'Koordinat tidak dikenali !'})
   }
})

// Menampilkan koordinat latitude dan longitude dari suatu lokasi
router.get('/coordinate', async (req, res) => {
   const coordinate = await geoCoder.geocode(req.query.loc)

   if(coordinate)  {
      // Ambil beberapa atribut geoCoder
      const locationCoordinate = coordinate.map(item => {
         const container = {}

         container.latitude = item.latitude
         container.longitude = item.longitude
         container.alamat_lengkap = item.formattedAddress

         return container
      })

      res.status(200).json(locationCoordinate)
   } else {
      res.status(400).json({ message: 'Lokasi tidak dikenali !'})
   }
})

export default router