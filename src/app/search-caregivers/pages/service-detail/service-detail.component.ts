import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Schedule, ServiceSearch } from '../../model/service-search';
import { ServiceSearchService } from '../../services/service-search.service';
import { CreateReservationDialogComponent } from '../../../reservations/components/create-reservation-dialog/create-reservation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEditScheduleComponent } from '../../components/create-edit-schedule/create-edit-schedule.component';
import { empty } from 'rxjs';

@Component({
    selector: 'app-service-detail',
    imports: [
        RouterLink,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './service-detail.component.html',
    styleUrl: './service-detail.component.css'
})
export class ServiceDetailComponent implements OnInit {
  public serviceSearchId?: number;
  public canEdit = false;

  public biographyEditMode = false;
  public biographyForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
  });

  public scheduleEditMode = false;

  public placesAndFareEditMode = false;
  public placesAndFareForm = new FormGroup({
    places: new FormControl<string[]>([]),
    farePerHour: new FormControl('', [Validators.required]),
  });
  public places: string[] = [];
  public farePerHour = 0;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  public serviceSearch?: ServiceSearch;
  public displayedScheduleColumns: string[] = ['weekDay', 'startHour', 'endHour'];

  constructor(
    private route: ActivatedRoute,
    private serviceSearchService: ServiceSearchService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.serviceSearchId = params['id'];
    });
  }

  ngOnInit() {
    if (!this.serviceSearchId) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      if (user?.role !== 'caregiver') return;
      this.canEdit = true;

      this.serviceSearchService
        .getByCaregiverId(user.id)
        .subscribe((services) => {
          console.log(services);
          this.serviceSearchId = services.id;
          this.serviceSearch = services;
          this.places = this.serviceSearch.districtsScope
            ? this.serviceSearch.districtsScope
              .split(',')
              .map((district) => district.trim())
            : [];
          this.farePerHour = this.serviceSearch.farePerHour || 0;

          this.placesAndFareForm.setValue({
            places: Array.from(this.places || []),
            farePerHour: this.farePerHour.toString(),
          });

          this.biographyForm.setValue({
            description: this.serviceSearch.biography,
          });

          this.serviceSearchService
            .getCaregiverScheduleById(this.serviceSearchId)
            .subscribe((schedule) => {
              if (this.serviceSearch) {
                this.serviceSearch.schedules = schedule;
              }
            });
        });
    } else
      this.serviceSearchService
        .getById(this.serviceSearchId)
        .subscribe((serviceSearch) => {
          this.serviceSearch = serviceSearch;

          this.places = this.serviceSearch.districtsScope
            ? this.serviceSearch.districtsScope
              .split(',')
              .map((district) => district.trim())
            : [];

          this.farePerHour = this.serviceSearch.farePerHour || 0;
          this.serviceSearchService
            .getCaregiverScheduleById(this.serviceSearch.id)
            .subscribe((schedule) => {
              if (this.serviceSearch) {
                this.serviceSearch.schedules = schedule;
              }
            });
        });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateReservationDialogComponent, {
      data: this.serviceSearch,
      width: '640px',
      maxWidth: '640px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);

      const message =
        result === 'success'
          ? 'Reservation created'
          : 'Reservation not created';

      this.snackBar.open(message, 'Close', {
        duration: 2000,
      });
    });
  }

  editSchedule() {
    this.scheduleEditMode = true;
    this.displayedScheduleColumns = [
      ...this.displayedScheduleColumns,
      'actions',
    ];
  }

  cancelEditBiographyMode($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.biographyEditMode = false;
  }

  updateDescription() {
    console.log('Updated');
    this.serviceSearchService
      .patchBiography({
        caregiverId: this.serviceSearchId,
        biography: this.biographyForm.value.description,
      })
      .subscribe(() => {
        this.snackBar.open('Biography description updated', 'Close', {
          duration: 3000,
        });
        this.biographyEditMode = false;

        if (this.serviceSearch?.description)
          this.serviceSearch.description =
            this.biographyForm.value.description || '';
      });
  }

  cancelEditSchedule() {
    this.scheduleEditMode = false;
    this.displayedScheduleColumns = this.displayedScheduleColumns.filter(
      (col) => col !== 'actions'
    );
  }

  openAddOrEditScheduleDialog(schedule?: Schedule) {
    const dialogRef = this.dialog.open(CreateEditScheduleComponent, {
      data: schedule,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { schedule: Schedule; editMode: boolean }) => {
        const tempSchedules = Array.from(this.serviceSearch?.schedules || []);

        if (result.editMode) {
          const scheduleIndex = this.serviceSearch?.schedules.findIndex(
            (s) => s === schedule
          );

          if (scheduleIndex !== undefined && scheduleIndex !== -1) {
            tempSchedules[scheduleIndex] = result.schedule;
          }

          console.log(result.schedule);

          this.serviceSearchService
            .updateCaregiverSchedule(schedule?.id, result.schedule)
            .subscribe(() => {
              this.serviceSearch!.schedules = tempSchedules;
              this.snackBar.open('Schedule updated', 'Close', {
                duration: 3000,
              });
            });
        } else {
          tempSchedules.push(result.schedule);

          console.log(result.schedule);

          this.serviceSearchService.addCaregiverSchedule(this.serviceSearchId, result.schedule)
            .subscribe(() => {
              this.serviceSearch!.schedules = tempSchedules;
              this.snackBar.open('Schedule added', 'Close', {
                duration: 3000,
              });
            });
        }
      });
  }

  deleteSchedule(schedule: Schedule) {
    const newSchedules = this.serviceSearch?.schedules.filter(
      (s) => s !== schedule
    );

    this.serviceSearchService
      .deleteCaregiverSchedule(schedule?.id)
      .subscribe(() => {
        this.snackBar.open('Schedule deleted', 'Close', {
          duration: 3000,
        });

        if (this.serviceSearch && newSchedules)
          this.serviceSearch.schedules = newSchedules;
      });
  }

  addPlace($event: MatChipInputEvent) {
    const tempPlaces = Array.from(this.placesAndFareForm.value.places || []);

    const value = ($event.value || '').trim();

    if (value) {
      tempPlaces.push(value);

      this.placesAndFareForm.setValue({
        places: tempPlaces,
        farePerHour: this.placesAndFareForm.value.farePerHour?.toString() || '',
      });
    }

    $event.chipInput!.clear();
  }

  editPlace(place: string, $event: MatChipEditedEvent) {
    const tempPlaces = Array.from(this.placesAndFareForm.value.places || []);
    const value = $event.value.trim();

    if (!value) {
      this.removePlace(place);
      return;
    }

    const index = this.placesAndFareForm.value.places?.indexOf(place);
    if (index && index >= 0) {
      tempPlaces[index] = value;

      this.placesAndFareForm.setValue({
        places: tempPlaces,
        farePerHour: this.placesAndFareForm.value.farePerHour?.toString() || '',
      });
    }
  }

  removePlace(place: string) {
    const index = this.placesAndFareForm.value.places?.indexOf(place);

    if (index && index >= 0) {
      this.placesAndFareForm.value.places?.splice(index, 1);
    }
  }

  updatePlacesAndFare($event: Event) {
    $event.preventDefault();

    console.log(this.placesAndFareForm.value.places?.join(','));
    console.log(Number(this.placesAndFareForm.value.farePerHour))

    this.serviceSearchService
      .patchPlaceFare({
        caregiverId: this.serviceSearchId,
        farePerHour: Number(this.placesAndFareForm.value.farePerHour),
        districtsScope: this.placesAndFareForm.value.places?.join(","),
      })
      .subscribe(() => {
        this.snackBar.open('Places and fare updated', 'Close', {
          duration: 3000,
        });

        this.placesAndFareEditMode = false;
        this.places = Array.from(this.placesAndFareForm.value.places ?? []);
        this.farePerHour = Number(this.placesAndFareForm.value.farePerHour);
      });
  }

  cancelEditPlacesAndFare($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.placesAndFareEditMode = false;
    this.placesAndFareForm.setValue({
      places: Array.from(this.places),
      farePerHour: Number(this.placesAndFareForm.value.farePerHour).toFixed(2),
    });
    // this.tempPlaces = Array.from(this.places);
  }
}
