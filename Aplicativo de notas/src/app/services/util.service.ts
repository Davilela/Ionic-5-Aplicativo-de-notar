import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public loading: HTMLIonLoadingElement;
  constructor(private loadingCtrl : LoadingController) { }

  async showLoading(message: string='Processando'){
    let loading = await this.loadingCtrl.create({message : message,
    duration: 100})
    loading.present();
  }
}
