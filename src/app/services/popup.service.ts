import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
    ) {}

  async showToast(message: any, dur) {
    const toast = await this.toastController.create({
        message, mode: 'ios',
        color: 'dark',
        duration: dur
    });
    await toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showAlertConfirm(header: string, message: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons: [
        {
            text: 'Yes',
            handler: () => {
                alert.dismiss(true);
                return false;
            }
        }, {
            text: 'No',
            handler: () => {
                alert.dismiss(false);
                return false;
            }
        }
      ]
    });
    await alert.present();
    const iya = await alert.onDidDismiss();
    return iya.data as boolean;
  }
}
