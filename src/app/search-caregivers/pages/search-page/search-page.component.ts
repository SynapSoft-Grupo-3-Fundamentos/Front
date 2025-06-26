import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CaregiverCardComponent } from '../../components/caregiver-card/caregiver-card.component';

import { FormsModule } from '@angular/forms';
import { ServiceSearch } from '../../model/service-search';
import { ServiceSearchService } from '../../services/service-search.service';

@Component({
    selector: 'app-search-page',
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormField,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        CaregiverCardComponent,
        FormsModule,
    ],
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit, OnChanges {
  searchServiceList: ServiceSearch[] = [];
  filteredSearchServiceList: ServiceSearch[] = [];
  orderByRating: 'caregiverExperience' | 'completedServices' | ''= '';
  locationOptions: string[] = [];
  selectedLocation = '';

  constructor(private serviceSearchService: ServiceSearchService) { }

  ngOnInit() {
    this.getCaregiversList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['selectedLocation']) {
      console.log('Location changed to: ', this.selectedLocation);
      console.log('Location changed to: ', changes);
    }
  }

  onReloadList() {
    this.searchCaregivers(this.selectedLocation, this.orderByRating );
  }

  getCaregiversList() {
    this.serviceSearchService.search("","").subscribe((searchResults) => {
      this.searchServiceList = searchResults;

      this.locationOptions = [
        ...new Set(
          searchResults
            .map(result => result.districtsScope)
            .join(',')
            .split(',')
            .map(district => district.trim())
        )
      ];

    });
  }


  searchCaregivers(district: string, sort: string) {
    this.serviceSearchService.search(district, sort).subscribe((searchResults) => {
      this.searchServiceList = searchResults;
    });
  }

}
