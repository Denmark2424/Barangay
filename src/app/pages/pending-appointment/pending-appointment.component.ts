import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppointmentService, Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-pending-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-appointment.component.html',
  styleUrls: ['./pending-appointment.component.css']
})
export class PendingAppointmentComponent implements OnInit {
  filteredAppointments$: Observable<Appointment[]>;
  private searchSubject = new BehaviorSubject<string>('');
  searchTerm: string = '';
  today: Date = new Date();

  pendingCount$: Observable<number>;
  approvedCount$: Observable<number>;
  rejectedCount$: Observable<number>;

  constructor(private appointmentService: AppointmentService) {
    const apps$ = this.appointmentService.getAppointments();
    
    this.pendingCount$ = apps$.pipe(map(apps => apps.filter(a => a.status === 'Pending').length));
    this.approvedCount$ = apps$.pipe(map(apps => apps.filter(a => a.status === 'Approved').length));
    this.rejectedCount$ = apps$.pipe(map(apps => apps.filter(a => a.status === 'Rejected').length));

    this.filteredAppointments$ = combineLatest([
      apps$,
      this.searchSubject.asObservable().pipe(startWith(''))
    ]).pipe(
      map(([apps, search]: [Appointment[], string]) => {
        const pendingReview = apps.filter(a => !a.reviewed);
        if (!search) return pendingReview;
        const s = search.toLowerCase();
        return pendingReview.filter(a => 
          a.babyName.toLowerCase().includes(s) || 
          a.guardianName.toLowerCase().includes(s) ||
          a.vaccineRequested?.toLowerCase().includes(s)
        );
      })
    );
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  ngOnInit(): void {}

  onApprove(id: string) {
    if (confirm('Approve this request and move it to the management database?')) {
      this.appointmentService.markAsReviewed(id);
    }
  }

  onReject(id: string) {
    if (confirm('Reject this request and move it to the records?')) {
      this.appointmentService.updateAppointmentStatus(id, 'Rejected');
      this.appointmentService.markAsReviewed(id);
    }
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.appointmentService.deleteAppointment(id);
    }
  }
}
