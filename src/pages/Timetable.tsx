import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

const timetableData = [
  {
    section: "BCA 1st Sem - Section A1",
    coordinator: "Mr. Chetan Pandey",
    room: "CR 101",
    schedule: [
      {
        day: "Wednesday",
        slots: [
          { time: "8:00-8:55", subject: "TBC103", faculty: "Dr. Shubham Kumar" },
          { time: "8:55-9:50", subject: "TBC101", faculty: "Ms. Pooja" },
          { time: "10:10-11:05", subject: "TBC104", faculty: "Ms. Shivani Monga" },
          { time: "11:05-12:00", subject: "TBC102", faculty: "Mr. Chetan Pandey" },
        ],
      },
      {
        day: "Thursday",
        slots: [
          { time: "8:00-8:55", subject: "TBC101", faculty: "Ms. Pooja" },
          { time: "8:55-9:50", subject: "TBC104", faculty: "Ms. Shivani Monga" },
          { time: "10:10-11:05", subject: "TBC103", faculty: "Dr. Shubham Kumar" },
          { time: "11:05-12:00", subject: "TBC102", faculty: "Mr. Chetan Pandey" },
        ],
      },
      {
        day: "Friday",
        slots: [
          { time: "8:00-8:55", subject: "TBC101", faculty: "Ms. Pooja" },
          { time: "8:55-9:50", subject: "TBC103", faculty: "Dr. Shubham Kumar" },
          { time: "10:10-11:05", subject: "TBC102", faculty: "Mr. Chetan Pandey" },
          { time: "11:05-12:00", subject: "TBC102", faculty: "Mr. Chetan Pandey" },
        ],
      },
      {
        day: "Saturday",
        slots: [
          { time: "8:00-8:55", subject: "PBC101 (Lab)", faculty: "Ms. Pooja", location: "LAB 8" },
          { time: "10:10-11:05", subject: "PBC102 (Lab)", faculty: "Mr. Chetan Pandey/Ms. Purva", location: "LAB 8" },
        ],
      },
    ],
  },
];

const subjects = [
  { code: "TBC101", name: "Computational Thinking and Fundamentals of IT" },
  { code: "TBC102", name: "Foundations of Computer Programming" },
  { code: "TBC103", name: "Mathematical Foundation of Computer Science" },
  { code: "TBC104", name: "Professional Communication" },
  { code: "PBC101", name: "Digital Productivity Tools for Modern Workplaces Lab" },
  { code: "PBC102", name: "Computer Programming Laboratory" },
];

const Timetable = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">BCA Timetable</h1>
                <p className="text-muted-foreground">Session 2025-2026 • Odd Semester</p>
              </div>
            </div>
            <Button className="bg-gradient-primary" asChild>
              <a href="/timetable.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>

        {timetableData.map((section, idx) => (
          <Card key={idx} className="p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{section.section}</h2>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>Class Coordinator: <strong className="text-foreground">{section.coordinator}</strong></span>
                <span>Room: <strong className="text-foreground">{section.room}</strong></span>
              </div>
            </div>

            <div className="space-y-4">
              {section.schedule.map((day, dayIdx) => (
                <div key={dayIdx} className="border rounded-lg overflow-hidden">
                  <div className="bg-gradient-primary text-white px-4 py-2 font-semibold">
                    {day.day}
                  </div>
                  <div className="divide-y">
                    {day.slots.map((slot, slotIdx) => (
                      <div key={slotIdx} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="font-mono text-sm text-muted-foreground">{slot.time}</span>
                            <div className="mt-1">
                              <span className="font-semibold text-primary">{slot.subject}</span>
                              <span className="text-sm text-muted-foreground ml-2">• {slot.faculty}</span>
                              {slot.location && (
                                <span className="text-sm text-muted-foreground ml-2">• {slot.location}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Subject Details</h3>
          <div className="grid gap-3">
            {subjects.map((subject, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="font-mono font-semibold text-primary min-w-[80px]">{subject.code}</span>
                <span>{subject.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Timetable;
