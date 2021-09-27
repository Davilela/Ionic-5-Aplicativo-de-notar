import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { __param } from 'tslib';
import { UtilService } from '../services/util.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
tasks: any[]=[];
processando: boolean = false;
  constructor(public alertController: AlertController, private alertCtrl : AlertController, private toastCtrl : ToastController, private actionSheet: ActionSheetController, private utilService: UtilService) {
    let taskJson = localStorage.getItem('taskDb');
    if(taskJson!=null){
      this.tasks = JSON.parse(taskJson);

    }
  }
  async showAdd(){
    this.processando=true;
    const alert = await this.alertCtrl.create({
      header: 'O que deseja adicionar?',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'O que deseja adicionar?'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.processando=false;
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            this.add(form.task);
            this.processando=false;
          }
        }
      ]
    });

    await alert.present();
  }

  async add(Task : string){
    this.processando=false;
    if(Task.trim().length < 1){
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'top'
      })
      toast.present();
      return;
    }
    this.utilService.showLoading();
    let taskadd = {name : Task, done: false, fav: false};
    this.processando=true;
    this.tasks.push(taskadd);
    this.updateLocalStorange();
  }

  updateLocalStorange(){
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }

  async openActions(t){
    const actionSheet = await this.actionSheet.create({
      header: 'O que deseja fazer?',
      buttons: [{
        text: t.done ? 'Desmarcar' : 'Marcar',
        icon: t.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          t.done = !t.done;
          this.updateLocalStorange();
        }
      }, 
      {
        text: t.fav ?  'Desfavoritar' : 'Favoritar',
        icon: t.fav ? 'star-outline' : 'star',
        handler: () => {
          t.fav = !t.fav;
          this.updateLocalStorange();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

  }
  delete(t : any){
    this.utilService.showLoading();
    this.tasks = this.tasks.filter(tArray => t != tArray);
    this.updateLocalStorange();
  }
  async deletAll(){
    const alert = await this.alertController.create({
      header: 'Apagar tudo',
      message: '<strong>Deseja mesmo apagar todas as mensagens?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Operação cancelada');
          }
        }, {
          text: 'Apagar',
          cssClass: 'secondary',
          handler: async() => {
            if(this.tasks.length!=0)
            {
            this.tasks.length=0; //esvaziando o vetor de tasks
            this.updateLocalStorange();
            console.log('tudo foi apagado!');
            }
            else {
              const toast = await this.toastCtrl.create({
                message: 'As tarefas já foram todas deletadas!',
                duration: 2000,
                position: 'top'
              })
              toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}