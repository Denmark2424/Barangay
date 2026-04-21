import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppointmentService, Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-appointment.component.html',
  styleUrls: ['./manage-appointment.component.css']
})
export class ManageAppointmentComponent implements OnInit {
  filteredAppointments$: Observable<Appointment[]>;
  private searchSubject = new BehaviorSubject<string>('');
  private statusSubject = new BehaviorSubject<string>('All');
  
  searchTerm: string = '';
  statusFilter: string = 'All';
  today: Date = new Date();

  constructor(private appointmentService: AppointmentService) {
    this.filteredAppointments$ = combineLatest([
      this.appointmentService.getAppointments(),
      this.searchSubject.asObservable().pipe(startWith('')),
      this.statusSubject.asObservable().pipe(startWith('All'))
    ]).pipe(
      map(([apps, search, status]) => {
        let filtered = apps.filter(a => a.reviewed);
        
        // Status Filter
        if (status !== 'All') {
          filtered = filtered.filter(a => a.status === status);
        }

        // Search Filter
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(a => 
            a.babyName.toLowerCase().includes(s) || 
            a.guardianName.toLowerCase().includes(s)
          );
        }
        
        return filtered;
      })
    );
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  onStatusChange(value: string) {
    this.statusSubject.next(value);
  }

  ngOnInit(): void {}

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  onApprove(id: string) {
    if (confirm('Approve this appointment?')) {
      this.appointmentService.updateAppointmentStatus(id, 'Approved');
    }
  }

  onReject(id: string) {
    if (confirm('Reject this appointment?')) {
      this.appointmentService.updateAppointmentStatus(id, 'Rejected');
    }
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to permanently delete this record?')) {
      this.appointmentService.deleteAppointment(id);
    }
  }
}
