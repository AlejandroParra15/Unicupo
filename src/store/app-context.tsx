import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

import type { Trip } from '@/data/mock-trips';

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';

export type Reservation = {
  tripId: string;
  status: ReservationStatus;
  reservedAt: number;
  rating?: number;
};

export type ChatMsg =
  | {
      kind: 'them';
      author: string;
      authorColor: string;
      text: string;
      time?: string;
    }
  | { kind: 'me'; text: string; time?: string }
  | { kind: 'system'; text: string };

export type PublishedTrip = {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  cupos: number;
  cuposReserved: number;
  price: string;
  repeat: boolean;
};

export type Mode = 'pasajero' | 'conductor';

type State = {
  mode: Mode;
  reservations: Reservation[];
  publishedTrips: PublishedTrip[];
  chatMessages: ChatMsg[];
};

type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'RESERVE'; tripId: string }
  | { type: 'CANCEL'; tripId: string }
  | { type: 'CONFIRM_ATTENDANCE'; tripId: string }
  | { type: 'START_ACTIVE'; tripId: string }
  | { type: 'COMPLETE'; tripId: string; rating?: number }
  | { type: 'PUBLISH_TRIP'; trip: PublishedTrip }
  | { type: 'ADD_MSG'; msg: ChatMsg }
  | { type: 'RESET' };

const seedReservations: Reservation[] = [
  { tripId: 'cm1', status: 'confirmed', reservedAt: Date.now() },
  { tripId: 'lr1', status: 'pending', reservedAt: Date.now() },
];

const seedPublishedTrips: PublishedTrip[] = [
  {
    id: 'pub-1',
    origin: 'Cañaverialejo',
    destination: 'Javeriana',
    date: 'Mañana',
    time: '6:30 AM',
    cupos: 4,
    cuposReserved: 0,
    price: '$3,000',
    repeat: true,
  },
  {
    id: 'pub-2',
    origin: 'Javeriana',
    destination: 'Sur',
    date: 'Viernes',
    time: '4:00 PM',
    cupos: 6,
    cuposReserved: 5,
    price: '$3,000',
    repeat: false,
  },
];

const seedChat: ChatMsg[] = [
  {
    kind: 'them',
    author: 'Carlos',
    authorColor: '#1A8A7D',
    text: 'Buenos días! Salgo en 10 min, los recojo en Chipichape',
  },
  { kind: 'me', text: 'Perfecto! Ya estoy acá', time: '6:28 AM' },
  {
    kind: 'them',
    author: 'Sebastián',
    authorColor: '#8E44AD',
    text: 'Llego en 3 min!',
    time: '6:32 AM',
  },
  { kind: 'system', text: 'Carlos inició el viaje' },
];

const initialState: State = {
  mode: 'pasajero',
  reservations: seedReservations,
  publishedTrips: seedPublishedTrips,
  chatMessages: seedChat,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'RESERVE': {
      const existing = state.reservations.find(
        (r) => r.tripId === action.tripId && r.status !== 'cancelled',
      );
      if (existing) return state;
      return {
        ...state,
        reservations: [
          ...state.reservations.filter((r) => r.tripId !== action.tripId),
          { tripId: action.tripId, status: 'confirmed', reservedAt: Date.now() },
        ],
      };
    }
    case 'CANCEL':
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.tripId === action.tripId ? { ...r, status: 'cancelled' } : r,
        ),
      };
    case 'CONFIRM_ATTENDANCE':
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.tripId === action.tripId && r.status === 'pending'
            ? { ...r, status: 'confirmed' }
            : r,
        ),
      };
    case 'START_ACTIVE':
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.tripId === action.tripId ? { ...r, status: 'active' } : r,
        ),
      };
    case 'COMPLETE':
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.tripId === action.tripId
            ? { ...r, status: 'completed', rating: action.rating }
            : r,
        ),
      };
    case 'PUBLISH_TRIP':
      return { ...state, publishedTrips: [action.trip, ...state.publishedTrips] };
    case 'ADD_MSG':
      return { ...state, chatMessages: [...state.chatMessages, action.msg] };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useReservation(tripId: string): Reservation | undefined {
  const { state } = useApp();
  return state.reservations.find((r) => r.tripId === tripId);
}

export function useAvailableCupos(trip: Trip): number {
  const { state } = useApp();
  const reserved = state.reservations.filter(
    (r) => r.tripId === trip.id && r.status !== 'cancelled',
  ).length;
  return Math.max(0, trip.cupos - reserved);
}
