import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'module',
    loadChildren: () =>
      import('remoteApp/Module').then(m => m.ModuleModule) // Ensure this matches the remote module configuration
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
