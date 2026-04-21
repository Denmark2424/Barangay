import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css']
})
export class ScheduleAppointmentComponent {
  appointmentForm: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      guardianName: ['', Validators.required],
      guardianContact: ['', Validators.required],
      guardianEmail: ['', [Validators.required, Validators.email]],
      relationship: ['', Validators.required],
      babyName: ['', Validators.required],
      babyDob: ['', Validators.required],
      babySex: ['', Validators.required],
      birthWeight: [''],
      vaccinesReceived: [''],
      vaccineRequested: [''],
      immunizationRecordNumber: [''],
      preferredDate: ['', Validators.required],
      preferredTime: ['', Validators.required],
      preferredClinic: ['', Validators.required],
      allergies: [''],
      medicalConditions: [''],
      recentIllness: [''],
      prematureBirth: [false]
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.appointmentForm.valid) {
      this.appointmentService.addAppointment(this.appointmentForm.value);
      alert('Appointment request submitted successfully! It is now pending for assessment.');
      this.appointmentForm.reset();
      this.isSubmitted = false;
      this.router.navigate(['/']);
    }
  }
}
