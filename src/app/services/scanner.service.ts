import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  settings = {
    preferFrontCamera : false, // iOS and Android
    showFlipCameraButton : true, // iOS and Android
    showTorchButton : true, // iOS and Android
    torchOn: false, // Android, launch with the torch switched on (if available)
    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    disableAnimations : true, // iOS
    disableSuccessBeep: false // iOS and Android
  };

  constructor(
  ) {}

}
