import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppointmentService, Appointment } from '../../services/appointment.service';

@Component({
  selector: 'app-immunization-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './immunization-records.component.html',
  styleUrls: ['./immunization-records.component.css']
})
export class ImmunizationRecordsComponent implements OnInit {
  paginatedRecords$: Observable<Appointment[]>;
  private searchSubject = new BehaviorSubject<string>('');
  private statusSubject = new BehaviorSubject<string>('All');
  private pageSubject = new BehaviorSubject<number>(1);
  
  searchTerm: string = '';
  statusFilter: string = 'All';
  today: Date = new Date();
  
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;

  constructor(private appointmentService: AppointmentService) {
    const filteredBase$ = combineLatest([
      this.appointmentService.getAppointments(),
      this.searchSubject.asObservable().pipe(startWith('')),
      this.statusSubject.asObservable().pipe(startWith('All'))
    ]).pipe(
      map(([apps, search, status]) => {
        let filtered = apps.filter(a => a.reviewed && a.status !== 'Rejected');

        if (status !== 'All') {
          filtered = filtered.filter(a => a.status === status);
        }

        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(a => 
            a.babyName.toLowerCase().includes(s) || 
            a.guardianName.toLowerCase().includes(s)
          );
        }
        this.totalItems = filtered.length;
        return filtered;
      })
    );

    this.paginatedRecords$ = combineLatest([
      filteredBase$,
      this.pageSubject.asObservable()
    ]).pipe(
      map(([filtered, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        return filtered.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  ngOnInit(): void {}

  onSearch(value: string) {
    this.currentPage = 1;
    this.pageSubject.next(1);
    this.searchSubject.next(value);
  }

  onStatusChange(value: string) {
    this.currentPage = 1;
    this.pageSubject.next(1);
    this.statusFilter = value;
    this.statusSubject.next(value);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageSubject.next(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageSubject.next(this.currentPage);
    }
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
