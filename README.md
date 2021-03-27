# Demo-Geocoder
API untuk menampilkan koordinat suatu lokasi dan sebaliknya dengan keterangan status ancaman banjir di wilayah tersebut. Cakupannya yaitu kelurahan di provinsi Yogyakarta.
API ini menggunakan modul NPM node-geocoder untuk mencari nama lokasi maupun koordinat lokasinya. Fungsi yang digunakan pertama yaitu geoCode() untuk mencari koordinat lokasi,
dengan parameter string nama lokasi. Kedua yaitu reverse() untuk mencari nama lokasi dengan parameter object berupa nilai latitude dan longitude. Sebelum menggunakan kedua fungsi
diatas, terlebih dahulu membuat object menggunakan konstruktor nodeGeocoder() dengan parameter option. Parameter ini didefinisikan sebelumnya, dan berisi setting provider map yang
hendak digunakan.

Endpoint yang digunakan :
1. /api/coordinate?loc=[nama lokasi]
Menampilkan daftar koordinat lokasi yang dimasukkan
2. /api/location?lat=[koordinat latitude]&lan=[koordinat longitude]
Menampilkan nama lokasi beserta status ancaman banjir dari koordinat latitude dan longitude
