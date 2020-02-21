## Instalasi Plugin Ionic
- install plugin dan package:
```
npm install @angular/fire @ionic-native/barcode-scanner moment angular-pipes phonegap-plugin-barcodescanner firebase @ionic-native/file-opener @ionic-native/file --save
```
- install cordova plugin:
```
ionic cordova plugin add cordova-plugin-file
ionic cordova plugin add phonegap-plugin-barcodescanner
ionic cordova plugin add cordova-plugin-file-opener2
```

## Update changes:

### v1.1.0:
- Verifikasi ganti status terkirim
- Tambah Analytic barang keluar per cs per hari
- Urutkan per nama penerima pada Scan Kirim
- NEW THEME!
- change ngx-pipes to angular-pipes package

### v1.1.1:
- add Scan Barang Masuk feature
- add Daftar List Ambilan feature

### v1.1.2:
- bug fixes

### v1.1.3:
- add date picker on Barang Masuk & List Ambilan
- add IonChange on datePicker