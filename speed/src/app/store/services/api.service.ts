import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, observable, pipe, PartialObserver } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StoreService } from './store/store.state';
import { LoadStatus, LoadAgency, LoadMission, LoadLaunches } from '../services/store/store.actions';
import { GlobalSlideTypes } from '../services/store/store.actions';
import { Launch } from '../models/launch';

@Injectable({
    providedIn: 'root'
  })

export class ApiService {
    public agencies:     any[];
    public launches:     any[];
    public status:       any[];
    public missionTypes: any[];
    private _url:        string;
    public missions: any[];

    public filterTypes = [
        { 'id': 0, 'name': 'State', 'value': 0 },
        { 'id': 1, 'name': 'Agency', 'value': 1},
        { 'id': 2, 'name': 'Mission  Type', 'value': 2 } ];

    constructor(private _http: HttpClient, private _store: StoreService) {
        this._url = 'http://localhost:4200';
    }

    public getFilterTypes (): any[] {
        return this.filterTypes;
    }

    public getLaunchStatus () {
        this._http.get(this._url + '/assets/data/launchstatus.json')
            .pipe(map(res => res['types'])
            ).subscribe( (status: any): any =>
                this._store.dispatch( new LoadStatus(status)) );
    }

    public getAgencies () {
        this._http.get(this._url + '/assets/data/agencies.json')
            .pipe(map(res => res['agencies'])
            ).subscribe( (agency: any): any =>
                this._store.dispatch( new LoadAgency(agency)) );
    }

    public getMissionTypes ()  {
        this._http.get(this._url + '/assets/data/missiontypes.json')
            .pipe(map(res => res['types'])
            ).subscribe( (mission: any): any =>
                this._store.dispatch( new LoadMission(mission)) );
    }

    public getAllLaunches() {
        this._http.get(this._url + '/assets/data/launches.json')
            .pipe(map(res => res['launches'])
            ).subscribe( (launches: any): any =>
                this._store.dispatch( new LoadLaunches(launches)) );
    }


    public getFilterLaunches( filterType: any, valueFilter: any): Observable<any> {

        const i = parseInt(filterType, 10);

        switch (i) {
            case 0: { // Status Filter
                return this._store
                    .select$(GlobalSlideTypes.launches)
                    .pipe(
                        map( (res: any): Launch[] =>
                            res.filter(launch => launch.status === valueFilter )
                        )
                    );
            }

            case 1: { // Agency Filter

                // launches.locations.pads.agencies
                // launches.rocket.agencies
                // launches.missions.agencies
                // launches.lsp.id ¿?

                return  this._store
                    .select$(GlobalSlideTypes.launches)
                    .pipe(
                        map( (res: any): Launch[] =>

                        /****************************************** NO FILTRA BIEN.....CORREGIR.

                            // res.filter( (launch: Launch) =>
                            //     launch['missions'].some( mission =>
                            //         mission.agencies &&
                            //         mission['agencies'].some( agency => agency.id === valueFilter)
                            //     )
                            // )
                            // ||
                            // res.filter( (launch: Launch) =>
                            //     launch.location.pads.some( pad =>
                            //         pad.agencies &&
                            //         pad.agencies.some( agency => agency.id === valueFilter )
                            //     )
                            // )
                            // ||

                        ****************************************** */

                            res.filter( (launch: Launch) =>
                                launch.rocket.agencies &&
                                launch.rocket.agencies.some( agency => agency.id === valueFilter)
                            )
                        ),

                    );
            }

            case 2: { // Mission Filter
                return this._store
                    .select$(GlobalSlideTypes.launches)
                    .pipe(
                        map( (res: any): Launch[] =>
                            res.filter( (launch: Launch) =>
                                launch.missions.find(mission => mission.type === valueFilter)
                            )
                        ),
                    );
            }

        }
    }

}
