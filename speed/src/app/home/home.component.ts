import { Component, OnInit } from '@angular/core';
import { ApiService } from '../store/services/api.service';
import { Observable, of, observable, pipe, PartialObserver } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ApiService]
})
export class HomeComponent implements OnInit {

  public launches: any[];
  public counterLaunch: number;
  public filterLaunches$: Observable<any>;

  constructor( private _api: ApiService ) {  }

  ngOnInit() {
      this._api.getLaunchStatus();
      this._api.getAgencies();
      this._api.getMissionTypes();
      this._api.getAllLaunches();
  }

  selectLaunches(valuesFilters) {
      this._api.getAllLaunches();
      this.filterLaunches$ = this._api.getFilterLaunches(valuesFilters[0], valuesFilters[1]);
  }
}
