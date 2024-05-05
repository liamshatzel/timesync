import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'time-sync';
  totViews = 10;
  constructor(private dataService: DataService) {} // Inject DataService instead of HttpClient
  fetchData() {
    this.dataService.getValues().subscribe(data => { // Use the injected service
      console.log(data);
      this.totViews = data;
    });
  }
}
