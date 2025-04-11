import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Tag, 
  Trash2,
  Pencil,
  FileText
} from "lucide-react";
import { Promoter } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CalendarViewProps {
  promoters: Promoter[];
  isLoading: boolean;
}

type CalendarView = "month" | "week" | "day";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  promoterId?: number;
  promoterName?: string;
  description?: string;
  location?: string;
  eventType: "booking" | "meeting" | "audition" | "photoshoot" | "event";
  status: "confirmed" | "tentative" | "cancelled";
}

// Utility function to get a color for an event type
const getEventTypeColor = (type: string): string => {
  switch (type) {
    case "booking":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "meeting":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "audition":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "photoshoot":
      return "bg-green-100 text-green-800 border-green-200";
    case "event":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Utility function to get a color for event status
const getEventStatusColor = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "tentative":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function CalendarView({ promoters, isLoading }: CalendarViewProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Form state for new event
  const [eventForm, setEventForm] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    location: "",
    eventType: "booking",
    status: "confirmed"
  });
  
  // Create sample events
  const today = new Date();
  const mockEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Photoshoot with Client A",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      startTime: "10:00",
      endTime: "12:00",
      promoterId: promoters[0]?.id,
      promoterName: promoters[0] ? `${promoters[0].firstName} ${promoters[0].lastName}` : undefined,
      description: "Promotional photoshoot for new campaign",
      location: "Studio 5, Downtown",
      eventType: "photoshoot",
      status: "confirmed"
    },
    {
      id: "2",
      title: "Client Meeting - Brand X",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      startTime: "14:00",
      endTime: "15:30",
      description: "Discuss requirements for upcoming event",
      location: "Virtual Meeting",
      eventType: "meeting",
      status: "confirmed"
    },
    {
      id: "3",
      title: "Fashion Show Audition",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      startTime: "11:00",
      endTime: "16:00",
      description: "Selecting talents for Brand Y fashion show",
      location: "Fashion Center",
      eventType: "audition",
      status: "tentative"
    }
  ];
  
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  
  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Check if a date has events
  const hasEvents = (date: Date): boolean => {
    return getEventsForDate(date).length > 0;
  };
  
  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  // Reset event form
  const resetEventForm = () => {
    setEventForm({
      title: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      location: "",
      eventType: "booking",
      status: "confirmed"
    });
  };
  
  // Handle form change
  const handleFormChange = (field: keyof Omit<CalendarEvent, "id">, value: any) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Add new event
  const addNewEvent = () => {
    if (!eventForm.title) {
      toast({
        title: "Missing Information",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }
    
    const newEvent: CalendarEvent = {
      ...eventForm,
      id: `event-${Date.now()}`
    };
    
    setEvents([...events, newEvent]);
    setShowAddEvent(false);
    resetEventForm();
    
    toast({
      title: "Event Created",
      description: "Your event has been added to the calendar."
    });
  };
  
  // Delete event
  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    setShowEventDetails(false);
    
    toast({
      title: "Event Deleted",
      description: "The event has been removed from the calendar."
    });
  };
  
  // Format date for display
  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Move to previous or next period
  const moveToPrevious = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    }
    setDate(newDate);
  };
  
  const moveToNext = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    }
    setDate(newDate);
  };
  
  const moveToToday = () => {
    setDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Calendar</h3>
          <p className="text-sm text-gray-500">Manage bookings, events, and schedules</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={moveToToday}>
            Today
          </Button>
          
          <Button variant="outline" size="icon" onClick={moveToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={moveToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="hidden md:block font-medium text-sm ml-2">
            {formatDateHeader(date)}
          </div>
          
          <Select value={view} onValueChange={(value) => setView(value as CalendarView)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => {
            resetEventForm();
            setShowAddEvent(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </div>
      
      <div className="md:hidden font-medium text-center mb-4">
        {formatDateHeader(date)}
      </div>
      
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="rounded-md border"
            modifiers={{
              hasEvents: (date) => hasEvents(date),
            }}
            modifiersClassNames={{
              hasEvents: "bg-orange-50 font-bold text-orange-600",
            }}
            footer={
              <div className="mt-4 grid grid-cols-7 gap-2 text-xs">
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-orange-500 mr-1"></div>
                  <span>Events</span>
                </div>
              </div>
            }
          />
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Events on {date.toLocaleDateString()}</h4>
            <div className="space-y-2">
              {getEventsForDate(date).length > 0 ? (
                getEventsForDate(date).map((event) => (
                  <div 
                    key={event.id} 
                    className={`p-3 rounded-md border ${getEventTypeColor(event.eventType)} hover:shadow-md cursor-pointer transition-shadow`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">{event.title}</h5>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {event.location && (
                          <div className="text-xs mt-1 text-gray-600">
                            {event.location}
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getEventStatusColor(event.status)}`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 border border-dashed rounded-md">
                  No events scheduled for this day
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Event Dialog */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event on your calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input 
                id="event-title" 
                placeholder="Enter event title" 
                value={eventForm.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {eventForm.date.toLocaleDateString()}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select 
                  value={eventForm.eventType}
                  onValueChange={(value) => handleFormChange("eventType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="audition">Audition</SelectItem>
                    <SelectItem value="photoshoot">Photoshoot</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input 
                  id="start-time" 
                  type="time" 
                  value={eventForm.startTime}
                  onChange={(e) => handleFormChange("startTime", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={eventForm.endTime}
                  onChange={(e) => handleFormChange("endTime", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-location">Location</Label>
              <Input 
                id="event-location" 
                placeholder="Enter location" 
                value={eventForm.location || ""}
                onChange={(e) => handleFormChange("location", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea 
                id="event-description" 
                placeholder="Enter event description" 
                value={eventForm.description || ""}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-status">Status</Label>
              <Select 
                value={eventForm.status}
                onValueChange={(value) => handleFormChange("status", value as "confirmed" | "tentative" | "cancelled")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="tentative">Tentative</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEvent(false)}>
              Cancel
            </Button>
            <Button onClick={addNewEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <div>
                <Badge 
                  variant="outline" 
                  className={`${getEventStatusColor(selectedEvent.status)}`}
                >
                  {selectedEvent.status}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div className="text-sm text-gray-500">
                    {selectedEvent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </div>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-500">{selectedEvent.location}</div>
                  </div>
                </div>
              )}
              
              {selectedEvent.promoterName && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Assigned Talent</div>
                    <div className="text-sm text-gray-500">{selectedEvent.promoterName}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Event Type</div>
                  <div className="text-sm text-gray-500">
                    <Badge className={getEventTypeColor(selectedEvent.eventType)}>
                      {selectedEvent.eventType.charAt(0).toUpperCase() + selectedEvent.eventType.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Description</div>
                    <div className="text-sm text-gray-500">{selectedEvent.description}</div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                className="text-red-600" 
                onClick={() => deleteEvent(selectedEvent.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowEventDetails(false)}>
                  Close
                </Button>
                <Button>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}