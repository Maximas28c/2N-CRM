import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutsComponent } from './shared/layouts/auth-layouts/auth-layouts.component';
import { SiteLayoutsComponent } from './shared/layouts/site-layouts/site-layouts.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { LoaderComponent } from './shared/layouts/loader/loader.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { CategoriesFormComponent } from './categories-page/categories-form/categories-form.component';
import { PositionFormComponent } from './categories-page/categories-form/position-form/position-form.component';
import { OrderCategoriesComponent } from './order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './order-page/order-positions/order-positions.component';
import { HistoryListComponent } from './history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './history-page/history-filter/history-filter.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutsComponent,
    SiteLayoutsComponent,
    RegistrationPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    OrderPageComponent,
    LoaderComponent,
    CategoriesPageComponent,
    CategoriesFormComponent,
    PositionFormComponent,
    OrderCategoriesComponent,
    OrderPositionsComponent,
    HistoryListComponent,
    HistoryFilterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
