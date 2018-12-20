import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../store/services/api.service';
import { StoreService } from '../store/services/store/store.state';
import { GlobalSlideTypes } from '../store/services/store/store.actions';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.css'],
  providers: [ApiService],
})

export class SearcherComponent implements OnInit {

  // array with differents values of Type Filter selected on first optional Select
  @Output() filtersValuesOutput  = new EventEmitter<any>();

  public launches:      any[];
  public filterTypes:   any[];
  public filterValues$: Observable<any>;

  constructor( private _api: ApiService,
               private _store: StoreService
            ) {  }

  ngOnInit() {
    this.selectFilterType();
    // this.selectFilterValue(0);
  }

  selectFilterType() {
    this.filterTypes = [ ... this._api.getFilterTypes()] ;
  }

  // Select possible values of Type Filter choose on Combo
  selectFilterValue(filterType) {

      let i = parseInt(filterType, 10);

      switch (i) {
            case 0: { // Status Filter
              this.filterValues$ = this._store
                  .select$(GlobalSlideTypes.status)
                  .pipe(map(status => status),
                        // tap(res => console.log('SearcherComponent.Status', res))
                  );
              break;
            }
            case 1: { // Agency Filter
                this.filterValues$ = this._store
                    .select$(GlobalSlideTypes.agency)
                    .pipe(map(agencies => agencies),
                        // tap(res => console.log('SearcherComponent.Agency', res))
                    );
                break;
            }
            case 2: { // Mission Filter
                this.filterValues$ = this._store
                    .select$(GlobalSlideTypes.mission)
                    .pipe(map(missions => missions),
                        // tap(res => console.log('SearcherComponent.Mission', res))
                    );
                break;
            }
      }
  }

  selectLaunches(valueSelected) {
      this.filtersValuesOutput.next(valueSelected);
  }


}
