import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ChartRow {
  id: number;
  name: string;
  age: string;
  sex: string;
  vaccine: string;
  date: string;
  worker: string;
  remarks: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  pendingCount$: Observable<number>;
  approvedCount$: Observable<number>;
  rejectedCount$: Observable<number>;
  totalCount$: Observable<number>;
  today: Date = new Date();

  chartData: ChartRow[] = [
    { id: 1, name: 'Juan Dela Cruz', age: '6 months', sex: 'Male', vaccine: 'Pentavalent', date: 'April 15, 2026', worker: 'BHW Maria Santos', remarks: 'Completed' },
    { id: 2, name: 'Maria Lopez', age: '1 year', sex: 'Female', vaccine: 'Measles-Rubella', date: 'April 15, 2026', worker: 'Nurse Ana Reyes', remarks: 'Completed' },
    { id: 3, name: 'Pedro Garcia', age: 'Newborn', sex: 'Male', vaccine: 'BCG, Hepatitis B', date: 'April 15, 2026', worker: 'Liza Cruz', remarks: 'First dose' },
    { id: 4, name: 'Ana Ramos', age: '9 months', sex: 'Female', vaccine: 'Oral Polio Vaccine', date: 'April 15, 2026', worker: 'BHW Carla Diaz', remarks: 'Completed' },
    { id: 5, name: 'Mark Torres', age: '2 years', sex: 'Male', vaccine: 'Booster Vaccine', date: 'April 15, 2026', worker: 'Nurse Ana Reyes', remarks: 'Completed' },
  ];

  constructor(private appointmentService: AppointmentService) {
    this.pendingCount$ = this.appointmentService.getAppointments().pipe(
      map(apps => apps.filter(a => a.status === 'Pending').length)
    );
    this.approvedCount$ = this.appointmentService.getAppointments().pipe(
      map(apps => apps.filter(a => a.status === 'Approved').length)
    );
    this.rejectedCount$ = this.appointmentService.getAppointments().pipe(
      map(apps => apps.filter(a => a.status === 'Rejected').length)
    );
    this.totalCount$ = this.appointmentService.getAppointments().pipe(
      map(apps => apps.length)
    );
  }
}
