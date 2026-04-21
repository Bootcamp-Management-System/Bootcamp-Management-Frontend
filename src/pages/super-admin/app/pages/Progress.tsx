import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { TrendingUp, Calendar, FileText, Link as LinkIcon, CheckCircle2, AlertTriangle } from "lucide-react";

const weeklyProgress = [
  { 
    id: 1, 
    groupName: "Data Warriors", 
    division: "Data Science", 
    bootcamp: "Python for Data Analysis",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "Data Cleaning & Preprocessing Project",
    description: "Completed comprehensive data cleaning on a 50k+ dataset. Implemented missing value handling, outlier detection, and feature engineering techniques. Created detailed visualizations...",
    hasFile: true,
    hasLink: true,
    submittedBy: "Ahmed Ali",
    submissionDate: "Apr 8, 2026",
    status: "submitted"
  },
  { 
    id: 2, 
    groupName: "Code Masters", 
    division: "Development", 
    bootcamp: "Full Stack Web Development",
    week: "Week 12",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "E-commerce Platform Backend API",
    description: "Built RESTful API with Node.js and Express. Implemented user authentication, product management, cart functionality, and payment integration. Used MongoDB for data persistence...",
    hasFile: true,
    hasLink: true,
    submittedBy: "Khaled Ibrahim",
    submissionDate: "Apr 7, 2026",
    status: "submitted"
  },
  { 
    id: 3, 
    groupName: "ML Explorers", 
    division: "Data Science", 
    bootcamp: "Machine Learning Fundamentals",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "Classification Model for Customer Churn",
    description: "Developed and evaluated multiple classification algorithms including Random Forest, SVM, and XGBoost. Achieved 89% accuracy with proper cross-validation and hyperparameter tuning...",
    hasFile: false,
    hasLink: true,
    submittedBy: "Laila Khaled",
    submissionDate: "Apr 9, 2026",
    status: "submitted"
  },
  { 
    id: 4, 
    groupName: "React Ninjas", 
    division: "Development", 
    bootcamp: "React Advanced Patterns",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "Advanced React Hooks Implementation",
    description: "Created custom hooks for form handling, API calls, and state management. Implemented compound components pattern and render props. Built reusable component library with TypeScript...",
    hasFile: true,
    hasLink: true,
    submittedBy: "Mariam Ali",
    submissionDate: "Apr 8, 2026",
    status: "submitted"
  },
  { 
    id: 5, 
    groupName: "Cyber Guardians", 
    division: "Cybersecurity", 
    bootcamp: "Network Security Basics",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "",
    description: "",
    hasFile: false,
    hasLink: false,
    submittedBy: "",
    submissionDate: "",
    status: "missing"
  },
  { 
    id: 6, 
    groupName: "Professional Leaders", 
    division: "CPD", 
    bootcamp: "Leadership & Management",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "Team Conflict Resolution Case Study",
    description: "Analyzed real-world conflict scenarios and applied various conflict resolution frameworks. Developed action plans for different team dynamics and leadership styles...",
    hasFile: true,
    hasLink: false,
    submittedBy: "Nadia Hassan",
    submissionDate: "Apr 9, 2026",
    status: "submitted"
  },
  { 
    id: 7, 
    groupName: "Security Elite", 
    division: "Cybersecurity", 
    bootcamp: "Ethical Hacking",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "Vulnerability Assessment Report",
    description: "Conducted comprehensive security audit on sample web application. Identified SQL injection, XSS, and CSRF vulnerabilities. Provided remediation recommendations and proof-of-concept...",
    hasFile: true,
    hasLink: true,
    submittedBy: "Mahmoud Ibrahim",
    submissionDate: "Apr 8, 2026",
    status: "submitted"
  },
  { 
    id: 8, 
    groupName: "Backend Builders", 
    division: "Development", 
    bootcamp: "Backend Development with Node.js",
    week: "Week 14",
    weekDate: "Apr 7 - Apr 13, 2026",
    title: "Microservices Architecture Implementation",
    description: "Designed and implemented microservices-based architecture using Docker containers. Set up API gateway, service discovery, and inter-service communication with message queues...",
    hasFile: true,
    hasLink: true,
    submittedBy: "Hossam Ali",
    submissionDate: "Apr 7, 2026",
    status: "submitted"
  },
];

const divisionColors: Record<string, string> = {
  "Data Science": "bg-purple-100 text-purple-700 border-purple-300",
  "Development": "bg-blue-100 text-blue-700 border-blue-300",
  "CPD": "bg-green-100 text-green-700 border-green-300",
  "Cybersecurity": "bg-red-100 text-red-700 border-red-300",
};

export function Progress() {
  const submittedCount = weeklyProgress.filter(p => p.status === "submitted").length;
  const missingCount = weeklyProgress.filter(p => p.status === "missing").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Progress</h1>
          <p className="text-gray-500 mt-1">Track group progress submissions (one per week per group)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            Week 14: Apr 7-13, 2026
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">32</p>
            <p className="text-xs text-gray-500 mt-1">Active this week</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-green-600">{submittedCount}</p>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">On time submissions</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-red-600">{missingCount}</p>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Need follow-up</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{Math.round((submittedCount / weeklyProgress.length) * 100)}%</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Submissions</CardTitle>
          <CardDescription>Group progress reports for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Bootcamp</TableHead>
                <TableHead>Submission Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklyProgress.map((progress) => (
                <TableRow key={progress.id} className={`cursor-pointer hover:bg-gray-50 ${progress.status === 'missing' ? 'bg-red-50' : ''}`}>
                  <TableCell className="font-medium text-gray-900">{progress.groupName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={divisionColors[progress.division]}>
                      {progress.division}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-[150px] truncate">{progress.bootcamp}</TableCell>
                  <TableCell className="font-medium text-gray-900 max-w-[200px]">
                    {progress.title || <span className="text-gray-400 italic">No submission</span>}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-[250px]">
                    <p className="line-clamp-2">{progress.description || <span className="text-gray-400 italic">—</span>}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {progress.hasFile && (
                        <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                          <FileText className="w-3 h-3 mr-1" />
                          File
                        </Badge>
                      )}
                      {progress.hasLink && (
                        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                          <LinkIcon className="w-3 h-3 mr-1" />
                          Link
                        </Badge>
                      )}
                      {!progress.hasFile && !progress.hasLink && (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">{progress.submittedBy || <span className="text-gray-400">—</span>}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{progress.submissionDate || <span className="text-gray-400">—</span>}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        progress.status === "submitted" 
                          ? "text-green-700 border-green-300 bg-green-50" 
                          : "text-red-700 border-red-300 bg-red-50"
                      }
                    >
                      {progress.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Missing Submissions Alert */}
      {missingCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Missing Submissions Alert</h3>
                <p className="text-sm text-gray-700 mt-1">
                  {missingCount} group(s) have not submitted their weekly progress report. Consider sending reminders or scheduling follow-up sessions.
                </p>
                <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700 hover:bg-red-100">
                  Send Reminders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
