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
      header, message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async showAlertConfirm(header: string, message: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header, message,
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
  /**
   * @param inputType "text" (default) | "number" | "date" | "email" | "password" | "search" | "tel" | "url" | "time" | "checkbox" | "radio"
   */
  async showAlertInput(header: string, message: string, options?: {okBtn?: string, inputType?: any, placeholder?: string}) {
    const alert = await this.alertController.create({
      mode: 'ios', header, message,
      inputs: [
        {
          name: 'input', type: options ? options.inputType : 'text',
          placeholder: options ? options.placeholder : ''
        }
      ],
      buttons: [
        {
          text: 'Batal',
          cssClass: 'primary',
          handler: () => {
            alert.dismiss(null);
          }
        },
        {
          text: options ? options.okBtn : 'Ok',
          handler: (data) => {
            alert.dismiss(data.input.trim());
          }
        }
      ]
    });
    await alert.present();
    const callback = await alert.onDidDismiss();
    return callback.data.values ? callback.data.values.input : null;
  }

  async showImage(header: string, message: string, linkImg: string) {
    const alert = await this.alertController.create({
      header,
      message: `
        <img src="${linkImg}" style="border-radius: 2px">
        <p>${message}</p>
      `,
      mode: 'ios', cssClass: 'pic-alert',
      buttons: [
        {
          text: 'Tutup',
          handler: () => {
            alert.dismiss();
            return false;
          }
        }
      ]
    });
    return await alert.present();
  }

}
