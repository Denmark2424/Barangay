import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Appointment {
  id: string;
  guardianName: string;
  guardianContact: string;
  guardianEmail: string;
  relationship: string;
  babyName: string;
  babyDob: string;
  babySex: string;
  birthWeight?: string;
  vaccinesReceived?: string;
  vaccineRequested?: string;
  immunizationRecordNumber?: string;
  preferredDate: string;
  preferredTime: string;
  preferredClinic: string;
  allergies?: string;
  medicalConditions?: string;
  recentIllness?: string;
  prematureBirth?: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsKey = 'barangay_appointments';
  private appointmentsSubject = new BehaviorSubject<Appointment[]>(this.loadAppointments());

  constructor() {}

  private loadAppointments(): Appointment[] {
    const saved = localStorage.getItem(this.appointmentsKey);
    if (!saved) return [];
    
    let apps: Appointment[] = JSON.parse(saved);
    
    // Data Migration: Ensure legacy records are marked as reviewed
    let migrated = false;
    apps = apps.map(app => {
      if (app.reviewed === undefined) {
        app.reviewed = (app.status === 'Approved' || app.status === 'Rejected');
        migrated = true;
      }
      return app;
    });

    if (migrated) {
      this.saveAppointments(apps);
    }
    
    return apps;
  }

  private saveAppointments(appointments: Appointment[]) {
    localStorage.setItem(this.appointmentsKey, JSON.stringify(appointments));
    this.appointmentsSubject.next(appointments);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) {
    const appointments = this.loadAppointments();
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      reviewed: false,
      createdAt: new Date()
    };
    appointments.push(newAppointment);
    this.saveAppointments(appointments);
  }

  markAsReviewed(id: string) {
    const appointments = this.loadAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].reviewed = true;
      this.saveAppointments(appointments);
    }
  }

  updateAppointmentStatus(id: string, status: 'Approved' | 'Rejected' | 'Pending') {
    const appointments = this.loadAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].status = status;
      this.saveAppointments(appointments);
    }
  }

  deleteAppointment(id: string) {
    const appointments = this.loadAppointments();
    const filtered = appointments.filter(a => a.id !== id);
    this.saveAppointments(filtered);
  }
}
