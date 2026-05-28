export type DateKey = 'hoy' | 'manana' | 'elegir';
export type Zone = 'sur' | 'norte' | 'centro' | 'oeste';

export type Trip = {
  id: string;
  initials: string;
  avatarColor: string;
  driver: string;
  car: string;
  plate: string;
  rating: number;
  time: string;
  hourOfDay: number;
  date: DateKey;
  zone: Zone;
  route: string;
  pickup: string;
  destination: string;
  price: string;
  cupos: number;
  cupoBadgeBg: string;
  cupoBadgeColor: string;
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'cm1',
    initials: 'CM',
    avatarColor: '#1A8A7D',
    driver: 'Carlos Mendez',
    car: 'Mazda 3 · Gris',
    plate: 'ABC-123',
    rating: 4.8,
    time: '6:30 AM',
    hourOfDay: 6,
    date: 'manana',
    zone: 'sur',
    route: 'Cafaverialejo → UHI',
    pickup: 'C.C. Chipichape',
    destination: 'Universidad Javeriana',
    price: '$3,000',
    cupos: 2,
    cupoBadgeBg: '#E0F5F3',
    cupoBadgeColor: '#1A8A7D',
  },
  {
    id: 'lr1',
    initials: 'LR',
    avatarColor: '#6B8E23',
    driver: 'Laura Rios',
    car: 'Renault Stepway',
    plate: 'DEF-456',
    rating: 4.6,
    time: '7:00 AM',
    hourOfDay: 7,
    date: 'manana',
    zone: 'sur',
    route: 'San Fernando → UHI',
    pickup: 'San Fernando',
    destination: 'Universidad Javeriana',
    price: '$3,500',
    cupos: 1,
    cupoBadgeBg: '#E8F5E9',
    cupoBadgeColor: '#4CAF50',
  },
  {
    id: 'jp1',
    initials: 'JP',
    avatarColor: '#888888',
    driver: 'Juan Perez',
    car: 'Chevrolet Spark',
    plate: 'GHI-789',
    rating: 4.3,
    time: '7:15 AM',
    hourOfDay: 7,
    date: 'manana',
    zone: 'sur',
    route: 'Teusaquillo → UHI',
    pickup: 'Teusaquillo',
    destination: 'Universidad Javeriana',
    price: '$3,500',
    cupos: 1,
    cupoBadgeBg: '#E0F5F3',
    cupoBadgeColor: '#1A8A7D',
  },
  {
    id: 'am1',
    initials: 'AM',
    avatarColor: '#3498DB',
    driver: 'Ana Morales',
    car: 'Kia Picanto · Rojo',
    plate: 'JKL-012',
    rating: 4.9,
    time: '8:30 AM',
    hourOfDay: 8,
    date: 'hoy',
    zone: 'norte',
    route: 'Granada → UHI',
    pickup: 'Av. 6N #28-50',
    destination: 'Universidad Javeriana',
    price: '$2,800',
    cupos: 3,
    cupoBadgeBg: '#E0F5F3',
    cupoBadgeColor: '#1A8A7D',
  },
  {
    id: 'dr1',
    initials: 'DR',
    avatarColor: '#9B59B6',
    driver: 'Daniel Ruiz',
    car: 'Toyota Yaris · Negro',
    plate: 'MNO-345',
    rating: 4.2,
    time: '9:00 AM',
    hourOfDay: 9,
    date: 'hoy',
    zone: 'centro',
    route: 'San Antonio → UHI',
    pickup: 'C.C. Centenario',
    destination: 'Universidad Javeriana',
    price: '$3,200',
    cupos: 2,
    cupoBadgeBg: '#E0F5F3',
    cupoBadgeColor: '#1A8A7D',
  },
  {
    id: 'sm1',
    initials: 'SM',
    avatarColor: '#E67E22',
    driver: 'Sofía Marín',
    car: 'Hyundai i10',
    plate: 'PQR-678',
    rating: 4.7,
    time: '6:00 AM',
    hourOfDay: 6,
    date: 'manana',
    zone: 'norte',
    route: 'Versalles → UHI',
    pickup: 'Av. 6N #15-20',
    destination: 'Universidad Javeriana',
    price: '$3,000',
    cupos: 2,
    cupoBadgeBg: '#E0F5F3',
    cupoBadgeColor: '#1A8A7D',
  },
  {
    id: 'fg1',
    initials: 'FG',
    avatarColor: '#16A085',
    driver: 'Felipe Gómez',
    car: 'Nissan March',
    plate: 'STU-901',
    rating: 4.5,
    time: '7:30 AM',
    hourOfDay: 7,
    date: 'hoy',
    zone: 'oeste',
    route: 'Pance → UHI',
    pickup: 'C.C. Jardín Plaza',
    destination: 'Universidad Javeriana',
    price: '$4,000',
    cupos: 1,
    cupoBadgeBg: '#E8F5E9',
    cupoBadgeColor: '#4CAF50',
  },
  {
    id: 'pv1',
    initials: 'PV',
    avatarColor: '#C0392B',
    driver: 'Paula Vélez',
    car: 'Mazda 2 · Blanco',
    plate: 'VWX-234',
    rating: 3.9,
    time: '6:45 AM',
    hourOfDay: 6,
    date: 'manana',
    zone: 'centro',
    route: 'Granada → UHI',
    pickup: 'Av. 4N #20-15',
    destination: 'Universidad Javeriana',
    price: '$2,500',
    cupos: 4,
    cupoBadgeBg: '#E0F5F3',
    cupoBadgeColor: '#1A8A7D',
  },
];

export const getTripById = (id: string): Trip | undefined =>
  MOCK_TRIPS.find((t) => t.id === id) ?? MOCK_TRIPS[0];

export type Filters = {
  date?: DateKey;
  zone?: Zone;
  minRating?: number;
  startHour?: number;
  endHour?: number;
};

export function filterTrips(filters: Filters): Trip[] {
  return MOCK_TRIPS.filter((trip) => {
    if (filters.date && trip.date !== filters.date) return false;
    if (filters.zone && trip.zone !== filters.zone) return false;
    if (filters.minRating !== undefined && trip.rating < filters.minRating) return false;
    if (filters.startHour !== undefined && trip.hourOfDay < filters.startHour) return false;
    if (filters.endHour !== undefined && trip.hourOfDay > filters.endHour) return false;
    return true;
  });
}
