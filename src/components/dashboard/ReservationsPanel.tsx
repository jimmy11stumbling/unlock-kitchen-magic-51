
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Reservation, ReservationStatus } from "@/types/reservations";

export interface ReservationsPanelProps {
  reservations: Reservation[];
  onAddReservation: (reservation: Omit<Reservation, "id">) => void;
  onUpdateStatus: (reservationId: number, status: ReservationStatus) => void;
}

export const ReservationsPanel: React.FC<ReservationsPanelProps> = ({
  reservations,
  onAddReservation,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Filter reservations for each tab
  const upcomingReservations = reservations.filter(
    (res) => res.status === "confirmed" || res.status === "pending"
  );
  
  const completedReservations = reservations.filter(
    (res) => res.status === "completed"
  );
  
  const cancelledReservations = reservations.filter(
    (res) => res.status === "cancelled" || res.status === "no-show"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reservations</h2>
        <Button>New Reservation</Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingReservations.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingReservations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No upcoming reservations</p>
          ) : (
            <div>
              {/* Render upcoming reservations here */}
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded mb-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{reservation.customerName}</h3>
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {reservation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {reservation.date} at {reservation.time} • Party of {reservation.partySize}
                  </p>
                  {reservation.tableNumber && (
                    <p className="text-sm">Table: {reservation.tableNumber}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUpdateStatus(reservation.id, "completed")}
                    >
                      Mark as Completed
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedReservations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No completed reservations</p>
          ) : (
            <div>
              {/* Render completed reservations here */}
              {completedReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded mb-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{reservation.customerName}</h3>
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      {reservation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {reservation.date} at {reservation.time} • Party of {reservation.partySize}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledReservations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No cancelled reservations</p>
          ) : (
            <div>
              {/* Render cancelled reservations here */}
              {cancelledReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded mb-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{reservation.customerName}</h3>
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                      {reservation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {reservation.date} at {reservation.time} • Party of {reservation.partySize}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
