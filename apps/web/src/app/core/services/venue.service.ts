import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Venue {
  _id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates?: { lat: number; lng: number };
  phone?: string;
  email?: string;
  hours?: Record<string, { open: string; close: string; closed?: boolean }>;
  amenities?: string[];
  courts?: Court[];
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  accessType?: string;
  registrationFee?: number;
  isActive?: boolean;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Court {
  _id: string;
  name: string;
  surface?: string;
  environment?: string;
  pricePerHour: number;
  isActive?: boolean;
  features?: string[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Booking {
  _id: string;
  venue?: Venue;
  court?: Court;
  venueName?: string;
  courtName?: string;
  date: string;
  startTime: string;
  endTime: string;
  price?: number;
  status?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class VenueService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchVenues(params?: Record<string, string>): Observable<Venue[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, value);
      });
    }
    return this.http.get<Venue[]>(`${this.base}/venues`, { params: httpParams });
  }

  getVenue(id: string): Observable<Venue> {
    return this.http.get<Venue>(`${this.base}/venues/${id}`);
  }

  getCourtAvailability(venueId: string, courtId: string, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<TimeSlot[]>(
      `${this.base}/venues/${venueId}/courts/${courtId}/availability`,
      { params }
    );
  }

  bookCourt(venueId: string, courtId: string, data: { courtId: string; date: string; startTime: string; endTime: string }): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.base}/venues/${venueId}/courts/${courtId}/book`,
      data
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings/mine`);
  }

  cancelBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/bookings/${id}`);
  }

  createVenue(data: Partial<Venue>): Observable<Venue> {
    return this.http.post<Venue>(`${this.base}/venues`, data);
  }

  updateVenue(id: string, data: Partial<Venue>): Observable<Venue> {
    return this.http.patch<Venue>(`${this.base}/venues/${id}`, data);
  }

  getMyVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${this.base}/venues/mine`);
  }

  addCourt(venueId: string, data: Partial<Court>): Observable<Court> {
    return this.http.post<Court>(`${this.base}/venues/${venueId}/courts`, data);
  }

  updateCourt(venueId: string, courtId: string, data: Partial<Court>): Observable<Court> {
    return this.http.patch<Court>(
      `${this.base}/venues/${venueId}/courts/${courtId}`,
      data
    );
  }

  removeCourt(venueId: string, courtId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/venues/${venueId}/courts/${courtId}`
    );
  }

  getVenueBookings(venueId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/venues/${venueId}/bookings`);
  }
}
