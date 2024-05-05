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
  maxTime = 0;
  constructor(private dataService: DataService) {} // Inject DataService instead of HttpClient
  fetchData() {
    this.dataService.getNumVisitors().subscribe((data) => {
      // Use the injected service
      console.log(data);
      this.totViews = data;
    });

    this.dataService.getMaxTime().subscribe((data) => {
      // Use the injected service
      console.log(data);
      this.maxTime = data;
    });
  }

  ngOnInit() {
    this.fetchData();
    this.curTime.subscribe((data) => {
      this.time = data;
    });
    window.addEventListener('beforeunload', this.sendTimeToBackend);
  }

  ngOnDestroy() {
    // Unsubscribe from the data service
    window.removeEventListener('beforeunload', this.sendTimeToBackend);
  }

  sendTimeToBackend() {
    // Send the time to the backend
    const payload = { time: this.time };

    this.dataService.sendTime(payload).subscribe({
      complete: () => console.log('Time sent successfully'),
      error: (err: any) => console.error('Error sending time', err),
    });
  }
}
