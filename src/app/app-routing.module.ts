import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: () =>
      import('aboutApp/Module').then(m => m.AboutModule) // Ensure this matches the remote module configuration
  }, {
    path: 'home',
    loadChildren: () =>
      import('homeApp/Module').then(m => m.HomeModule) // Ensure this matches the remote module configuration
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
