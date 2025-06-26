import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Schedule } from '../../model/service-search';
import { ServiceSearchService } from '../../services/service-search.service';

@Component({
    selector: 'app-create-edit-schedule',
    imports: [
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FormsModule,
    ],
    templateUrl: './create-edit-schedule.component.html',
    styleUrl: './create-edit-schedule.component.css'
})
export class CreateEditScheduleComponent {
  public editMode = false;

  public scheduleForm = new FormGroup({
    day: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  });

  public daySelectOptions = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' },
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateEditScheduleComponent>,
    private serviceSearchService: ServiceSearchService,
    @Inject(MAT_DIALOG_DATA)
    public data?: Schedule
  ) {
    if (!data) return;

    this.editMode = true;
    this.scheduleForm.setValue({
      day: data.weekDay,
      startTime: data.startHour,
      endTime: data.endHour,
    });
  }

  handleSubmit($event: Event) {
    $event.preventDefault();

    const schedule: Schedule = {
      id: this.data?.id || 0,
      weekDay: this.scheduleForm.value.day || '',
      startHour: this.scheduleForm.value.startTime || '',
      endHour: this.scheduleForm.value.endTime || '',
    };
    this.dialogRef.close({ schedule, editMode: this.editMode });
  }
  handleCancel($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialogRef.close();
  }
}
