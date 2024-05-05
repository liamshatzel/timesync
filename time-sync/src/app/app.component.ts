import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { interval, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'time-sync';

  curTime = interval(1000).pipe(
    startWith(0),
    map((seconds) => seconds + 1)
  );
  totViews = 0;
  time = 0;
  constructor(private dataService: DataService) {} // Inject DataService instead of HttpClient
  fetchData() {
    this.dataService.getValues().subscribe((data) => {
      // Use the injected service
      console.log(data);
      this.totViews = data;
    });
  }

  ngOnInit() {
    this.fetchData();
    this.curTime.subscribe((data) => {
      this.time = data;
    });
  }
}
