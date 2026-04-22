import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // SMS CONFIG (SEMAPHORE)
  private readonly API_KEY = 'd1ff496846440d66f0f55f8dcd4fbaa5';
  private readonly SMS_URL = 'https://api.semaphore.co/api/v4/messages';

  constructor(private http: HttpClient) { }

  /**
   * Sends an SMS using Semaphore API (via Proxy to bypass CORS)
   */
  sendSms(mobileNumber: string, message: string): Observable<any> {
    const targetUrl = `https://api.semaphore.co/api/v4/messages`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    // Semaphore expects form-encoded data
    const body = new HttpParams()
      .set('apikey', this.API_KEY)
      .set('number', mobileNumber)
      .set('message', message);

    console.log(`🚀 Attempting to send Semaphore SMS to ${mobileNumber} (via Form Data)...`);
    
    return this.http.post(proxyUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  /**
   * Helper to send appointment status updates via SMS
   */
  notifyAppointmentStatus(contact: string, name: string, status: 'Approved' | 'Rejected') {
    const message = status === 'Approved'
      ? `Hi ${name}, your immunization appointment has been APPROVED. Please wait for the admin to schedule your date. Thank you!`
      : `Hi ${name}, your immunization appointment has been REJECTED. Please contact your Barangay Health Center for clarification. Thank you!`;

    this.sendSms(contact, message).subscribe({
      next: (res) => console.log('✅ Status SMS Sent:', res),
      error: (err) => console.error('❌ Status SMS Failed!', err)
    });
  }

  /**
   * Helper to send schedule confirmation via SMS
   */
  notifyAppointmentSchedule(contact: string, name: string, date: string, time: string, clinic: string) {
    const message = `Hi ${name}, your immunization appointment is scheduled on ${date} at ${time} (${clinic}). See you there!`;

    this.sendSms(contact, message).subscribe({
      next: (res) => console.log('✅ Schedule SMS Sent:', res),
      error: (err) => console.error('❌ Schedule SMS Failed!', err)
    });
  }
}
