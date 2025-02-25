
export interface TableLayout {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: "indoor" | "outdoor" | "bar";
  reservationId?: number;
  activeOrder?: number | null;
}

export interface TableSection {
  id: string;
  name: string;
  capacity: number;
  tables: TableLayout[];
}
