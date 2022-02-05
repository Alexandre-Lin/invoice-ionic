import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PreviewPrintComponent} from './preview-print/preview-print.component';
import {TextViewComponent} from "./text-view/text-view.component";

const routes: Routes = [
  {
    path: 'preview-print/:key',
    component: PreviewPrintComponent
  }, {
    path: 'text-view',
    component: TextViewComponent
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
