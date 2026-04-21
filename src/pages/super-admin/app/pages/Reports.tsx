import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FileText, Download, Sparkles, TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const divisionPerformance = [
  { division: "Data Science", attendance: 92, avgScore: 88, completion: 85 },
  { division: "Development", attendance: 88, avgScore: 85, completion: 90 },
  { division: "CPD", attendance: 85, avgScore: 82, completion: 78 },
  { division: "Cybersecurity", attendance: 90, avgScore: 86, completion: 82 },
];

const topStudents = [
  { name: "Sara Mohamed", division: "Development", attendance: 98, avgScore: 94, tasksCompleted: 18 },
  { name: "Omar Hassan", division: "Cybersecurity", attendance: 95, avgScore: 93, tasksCompleted: 12 },
  { name: "Fatima Ali", division: "Data Science", attendance: 92, avgScore: 89, tasksCompleted: 16 },
  { name: "Nour Ibrahim", division: "CPD", attendance: 90, avgScore: 88, tasksCompleted: 12 },
  { name: "Mariam Khaled", division: "Development", attendance: 94, avgScore: 88, tasksCompleted: 17 },
];

const reportTypes = [
  { 
    icon: Users, 
    title: "Student Performance Report", 
    description: "Comprehensive analysis of student progress, attendance, and grades",
    color: "bg-blue-100 text-blue-700"
  },
  { 
    icon: Calendar, 
    title: "Session Summary Report", 
    description: "Overview of all sessions, attendance rates, and feedback",
    color: "bg-purple-100 text-purple-700"
  },
  { 
    icon: FileText, 
    title: "Task & Submission Report", 
    description: "Complete breakdown of tasks, submission rates, and grading",
    color: "bg-green-100 text-green-700"
  },
  { 
    icon: BarChart3, 
    title: "Division Analytics Report", 
    description: "Performance comparison across all divisions",
    color: "bg-orange-100 text-orange-700"
  },
  { 
    icon: TrendingUp, 
    title: "Progress Tracking Report", 
    description: "Weekly progress for all projects and bootcamps",
    color: "bg-red-100 text-red-700"
  },
  { 
    icon: Sparkles, 
    title: "AI Insights Report", 
    description: "AI-generated trends, predictions, and recommendations",
    color: "bg-indigo-100 text-indigo-700"
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Generate comprehensive reports and view system analytics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-500 mt-1">Across 4 divisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Attendance</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">89%</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Task Completion</CardTitle>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">87%</p>
            <p className="text-sm text-gray-500 mt-1">Overall rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Score</CardTitle>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">84%</p>
            <p className="text-sm text-gray-500 mt-1">All bootcamps</p>
          </CardContent>
        </Card>
      </div>

      {/* Division Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Division Performance Overview</CardTitle>
              <CardDescription>Attendance, average score, and completion rates by division</CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divisionPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="division" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgScore" fill="#10b981" name="Avg Score %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completion" fill="#f59e0b" name="Completion %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Students */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>Highest overall performance this month</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStudents.map((student, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">#{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <Badge variant="outline">{student.division}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{student.attendance}% attendance</span>
                    <span>•</span>
                    <span>{student.avgScore}% avg score</span>
                    <span>•</span>
                    <span>{student.tasksCompleted} tasks completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Create custom reports for different aspects of the bootcamp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report, idx) => {
              const Icon = report.icon;
              return (
                <div key={idx} className="p-4 border rounded-lg hover:border-blue-300 transition-colors group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{report.title}</h3>
                      <p className="text-xs text-gray-600">{report.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
