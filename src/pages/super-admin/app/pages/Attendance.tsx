import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { AlertTriangle, CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const attendanceData = [
  { id: 1, session: "Python Basics", date: "Apr 7, 2026", time: "09:00 - 11:00", total: 18, present: 16, late: 1, absent: 1, rate: 89 },
  { id: 2, session: "Database Design", date: "Apr 7, 2026", time: "14:00 - 16:00", total: 22, present: 20, late: 2, absent: 0, rate: 91 },
  { id: 3, session: "React Hooks Deep Dive", date: "Apr 8, 2026", time: "11:30 - 13:30", total: 18, present: 18, late: 0, absent: 0, rate: 100 },
  { id: 4, session: "Neural Networks Intro", date: "Apr 8, 2026", time: "14:00 - 16:00", total: 15, present: 12, late: 1, absent: 2, rate: 80 },
  { id: 5, session: "Network Protocols", date: "Apr 8, 2026", time: "16:30 - 18:30", total: 11, present: 10, late: 0, absent: 1, rate: 91 },
];

export function Attendance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1">Track and manage student attendance</p>
      </div>

      {/* Constraint Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900">Post-Session Attendance Only</h3>
              <p className="text-sm text-gray-700 mt-1">
                Per system policy, attendance can only be recorded <strong>after</strong> the session has ended. 
                You cannot mark attendance before or during an active session.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Rate</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">89%</p>
              <span className="flex items-center text-sm text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                -3%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">76</p>
            <p className="text-sm text-gray-500 mt-1">Of 84 students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Late</CardTitle>
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">4</p>
            <p className="text-sm text-gray-500 mt-1">5% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Absent</CardTitle>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">4</p>
            <p className="text-sm text-gray-500 mt-1">5% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Pattern Detection */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">AI Pattern Detection</h3>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">Active</Badge>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Trend Alert:</strong> Overall attendance dropped 3% this week compared to last week.
                <strong className="ml-2">Risk Pattern:</strong> 8 students have 2+ consecutive absences.
                Development division has lowest attendance (85%) - recommend follow-up.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Session Attendance</CardTitle>
              <CardDescription>Attendance records for completed sessions</CardDescription>
            </div>
            <Button variant="outline">View All Sessions</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-center">Total Students</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.session}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-900">{record.date}</span>
                      <span className="text-xs text-gray-500">{record.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{record.total}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      {record.present}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                      {record.late}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
                      {record.absent}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        record.rate >= 90 ? 'bg-green-500' :
                        record.rate >= 75 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`} />
                      <span className={`font-semibold ${
                        record.rate >= 90 ? 'text-green-600' :
                        record.rate >= 75 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {record.rate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
