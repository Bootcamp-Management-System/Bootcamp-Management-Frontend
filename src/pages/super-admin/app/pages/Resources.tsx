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
import { FileText, Video, Image as ImageIcon, Archive, Link as LinkIcon, Download, Plus, Upload } from "lucide-react";

const resources = [
  { id: 1, name: "Python Basics - Lecture Notes.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "Dr. Sarah Ahmed", division: "Data Science", bootcamp: "Python for Data Analysis", downloads: 45, uploadDate: "Apr 5, 2026" },
  { id: 2, name: "React Hooks Tutorial Video", type: "Video", size: "125 MB", uploadedBy: "Omar Khaled", division: "Development", bootcamp: "React Advanced Patterns", downloads: 38, uploadDate: "Apr 4, 2026" },
  { id: 3, name: "Neural Networks Slides.pdf", type: "PDF", size: "8.1 MB", uploadedBy: "Dr. Mohamed Ali", division: "Data Science", bootcamp: "Machine Learning Fundamentals", downloads: 32, uploadDate: "Apr 3, 2026" },
  { id: 4, name: "Network Security Lab Files.zip", type: "ZIP", size: "15.6 MB", uploadedBy: "Dr. Khaled Youssef", division: "Cybersecurity", bootcamp: "Network Security Basics", downloads: 28, uploadDate: "Apr 2, 2026" },
  { id: 5, name: "Database Design Examples", type: "Link", size: "External", uploadedBy: "Ahmed Hassan", division: "Development", bootcamp: "Full Stack Web Development", downloads: 56, uploadDate: "Apr 1, 2026" },
  { id: 6, name: "Data Visualization Workshop.pdf", type: "PDF", size: "5.2 MB", uploadedBy: "Dr. Sarah Ahmed", division: "Data Science", bootcamp: "Python for Data Analysis", downloads: 41, uploadDate: "Mar 31, 2026" },
  { id: 7, name: "Communication Skills Images", type: "Image", size: "3.8 MB", uploadedBy: "Nour Mohamed", division: "CPD", bootcamp: "Professional Communication", downloads: 22, uploadDate: "Mar 30, 2026" },
  { id: 8, name: "Ethical Hacking Tools.zip", type: "ZIP", size: "45.2 MB", uploadedBy: "Dr. Amr Hassan", division: "Cybersecurity", bootcamp: "Ethical Hacking", downloads: 19, uploadDate: "Mar 29, 2026" },
];

const getFileIcon = (type: string) => {
  switch(type) {
    case "PDF": return FileText;
    case "Video": return Video;
    case "Image": return ImageIcon;
    case "ZIP": return Archive;
    case "Link": return LinkIcon;
    default: return FileText;
  }
};

const getFileColor = (type: string) => {
  switch(type) {
    case "PDF": return "text-red-600 bg-red-50 border-red-200";
    case "Video": return "text-purple-600 bg-purple-50 border-purple-200";
    case "Image": return "text-blue-600 bg-blue-50 border-blue-200";
    case "ZIP": return "text-orange-600 bg-orange-50 border-orange-200";
    case "Link": return "text-green-600 bg-green-50 border-green-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const divisionColors: Record<string, string> = {
  "Data Science": "bg-purple-100 text-purple-700 border-purple-300",
  "Development": "bg-blue-100 text-blue-700 border-blue-300",
  "CPD": "bg-green-100 text-green-700 border-green-300",
  "Cybersecurity": "bg-red-100 text-red-700 border-red-300",
};

export function Resources() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-500 mt-1">Manage learning materials and resources</p>
        </div>
        <Button className="gap-2 bg-[#f06a6a] hover:bg-[#e55a5a]">
          <Upload className="w-4 h-4" />
          Upload Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-500 mt-1">Across all divisions</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">PDFs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">28</p>
            <p className="text-xs text-gray-500 mt-1">Most popular type</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 mt-1">Tutorial content</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">1,284</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Resources Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
          <CardDescription>Learning materials uploaded by instructors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Bootcamp</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-center">Downloads</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => {
                const Icon = getFileIcon(resource.type);
                const colorClass = getFileColor(resource.type);
                
                return (
                  <TableRow key={resource.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded border flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">{resource.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={colorClass}>
                        {resource.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={divisionColors[resource.division]}>
                        {resource.division}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm max-w-[200px] truncate">{resource.bootcamp}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{resource.uploadedBy}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{resource.size}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Download className="w-3 h-3 text-gray-500" />
                        <span className="font-medium text-gray-900">{resource.downloads}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{resource.uploadDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-[#f06a6a] hover:text-[#e55a5a] hover:bg-[#fff5f5]">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
