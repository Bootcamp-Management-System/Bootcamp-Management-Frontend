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
import { Users, Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

const groups = [
  { 
    id: 1, 
    name: "Data Warriors", 
    division: "Data Science", 
    bootcamp: "Python for Data Analysis",
    members: [
      { name: "Ahmed Ali", initials: "AA" },
      { name: "Sara Mohamed", initials: "SM" },
      { name: "Omar Hassan", initials: "OH" },
      { name: "Fatima Youssef", initials: "FY" },
    ],
    weeklySubmissions: 8,
    status: "active"
  },
  { 
    id: 2, 
    name: "Code Masters", 
    division: "Development", 
    bootcamp: "Full Stack Web Development",
    members: [
      { name: "Khaled Ibrahim", initials: "KI" },
      { name: "Nour Ahmed", initials: "NA" },
      { name: "Youssef Ali", initials: "YA" },
      { name: "Mona Hassan", initials: "MH" },
      { name: "Hassan Omar", initials: "HO" },
    ],
    weeklySubmissions: 12,
    status: "active"
  },
  { 
    id: 3, 
    name: "ML Explorers", 
    division: "Data Science", 
    bootcamp: "Machine Learning Fundamentals",
    members: [
      { name: "Laila Khaled", initials: "LK" },
      { name: "Amr Youssef", initials: "AY" },
      { name: "Dina Mohamed", initials: "DM" },
    ],
    weeklySubmissions: 6,
    status: "active"
  },
  { 
    id: 4, 
    name: "React Ninjas", 
    division: "Development", 
    bootcamp: "React Advanced Patterns",
    members: [
      { name: "Mariam Ali", initials: "MA" },
      { name: "Tarek Hassan", initials: "TH" },
      { name: "Yasmin Omar", initials: "YO" },
      { name: "Rami Khaled", initials: "RK" },
    ],
    weeklySubmissions: 10,
    status: "active"
  },
  { 
    id: 5, 
    name: "Cyber Guardians", 
    division: "Cybersecurity", 
    bootcamp: "Network Security Basics",
    members: [
      { name: "Ali Mohamed", initials: "AM" },
      { name: "Hana Youssef", initials: "HY" },
      { name: "Karim Ali", initials: "KA" },
    ],
    weeklySubmissions: 5,
    status: "active"
  },
  { 
    id: 6, 
    name: "Professional Leaders", 
    division: "CPD", 
    bootcamp: "Leadership & Management",
    members: [
      { name: "Nadia Hassan", initials: "NH" },
      { name: "Sami Omar", initials: "SO" },
      { name: "Rana Khaled", initials: "RK" },
      { name: "Ziad Ali", initials: "ZA" },
    ],
    weeklySubmissions: 7,
    status: "active"
  },
  { 
    id: 7, 
    name: "Security Elite", 
    division: "Cybersecurity", 
    bootcamp: "Ethical Hacking",
    members: [
      { name: "Mahmoud Ibrahim", initials: "MI" },
      { name: "Salma Mohamed", initials: "SM" },
    ],
    weeklySubmissions: 4,
    status: "active"
  },
  { 
    id: 8, 
    name: "Backend Builders", 
    division: "Development", 
    bootcamp: "Backend Development with Node.js",
    members: [
      { name: "Hossam Ali", initials: "HA" },
      { name: "Aya Hassan", initials: "AH" },
      { name: "Mostafa Omar", initials: "MO" },
      { name: "Noha Khaled", initials: "NK" },
    ],
    weeklySubmissions: 9,
    status: "active"
  },
];

const divisionColors: Record<string, string> = {
  "Data Science": "bg-purple-100 text-purple-700 border-purple-300",
  "Development": "bg-blue-100 text-blue-700 border-blue-300",
  "CPD": "bg-green-100 text-green-700 border-green-300",
  "Cybersecurity": "bg-red-100 text-red-700 border-red-300",
};

const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500"];

export function Groups() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500 mt-1">Manage student groups across bootcamps (2-8 members)</p>
        </div>
        <Button className="gap-2 bg-[#f06a6a] hover:bg-[#e55a5a]">
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">32</p>
            <p className="text-xs text-gray-500 mt-1">Across all divisions</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Group Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">4.2</p>
            <p className="text-xs text-gray-500 mt-1">Students per group</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">32</p>
            <p className="text-xs text-gray-500 mt-1">All groups active</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Groups</CardTitle>
          <CardDescription>Student groups organized by division and bootcamp</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Bootcamp</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-center">Size</TableHead>
                <TableHead className="text-center">Weekly Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group, idx) => (
                <TableRow key={group.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{group.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={divisionColors[group.division]}>
                      {group.division}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-[200px] truncate">{group.bootcamp}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member, memberIdx) => (
                        <Avatar key={memberIdx} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className={`${avatarColors[memberIdx % avatarColors.length]} text-white text-xs`}>
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">+{group.members.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span className="font-medium text-gray-900">{group.members.length}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-gray-900">{group.weeklySubmissions}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      {group.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-[#f06a6a] hover:text-[#e55a5a] hover:bg-[#fff5f5]">
                      <UserPlus className="w-4 h-4" />
                    </Button>
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
