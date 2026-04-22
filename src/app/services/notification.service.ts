import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // SMS CONFIG (IPROG)
  private readonly API_KEY = 'b24d6bb21f88ff6a0450a1a8bbb4bcb60834b358';
  private readonly SMS_URL = 'https://www.iprogsms.com/api/v1/sms_messages';

  constructor(private http: HttpClient) { }

  /**
   * Sends an SMS using IPROG SMS API (via Proxy to bypass CORS)
   */
  sendSms(mobileNumber: string, message: string): Observable<any> {
    // Convert 09XXXXXXXXX to 639XXXXXXXXX
    let formattedNumber = mobileNumber;
    if (mobileNumber.startsWith('0')) {
      formattedNumber = '63' + mobileNumber.substring(1);
    }

    // Use the official IPROG endpoint
    const targetUrl = 'https://www.iprogsms.com/api/v1/sms_messages';
    
    // Prefix with the proxy to bypass CORS
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const payload = {
      api_token: this.API_KEY,
      phone_number: formattedNumber,
      message: message
    };

    console.log(`🚀 Attempting to send SMS POST to ${formattedNumber} (via Proxy)...`);
    
    // We must use POST as per IPROG documentation
    return this.http.post(proxyUrl, payload);
  }

  /**
   * Helper to send appointment status updates via SMS
   */
  notifyAppointmentStatus(contact: string, name: string, status: 'Approved' | 'Rejected') {
    const message = status === 'Approved'
      ? `Hi ${name}, your immunization appointment has been APPROVED. Please be at the clinic on your scheduled date. Thank you!`
      : `Hi ${name}, your immunization appointment has been REJECTED. Please contact your Barangay Health Center for clarification. Thank you!`;

    // Send SMS
    this.sendSms(contact, message).subscribe({
      next: (res) => console.log('✅ SMS API Response:', res),
      error: (err) => {
        console.error('❌ SMS Sending Failed!', err);
      }
    });
  }
}
