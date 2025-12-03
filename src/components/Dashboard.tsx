import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Total Inspections",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Open Issues",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Passed Inspections",
      value: "142",
      change: "+15%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Critical Issues",
      value: "5",
      change: "-2",
      trend: "down",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const recentInspections = [
    {
      id: "INS-001",
      project: "Kohinoor Reina",
      status: "Passed",
      date: "2025-11-14",
      inspector: "Prasad Kulkarni",
    },
    {
      id: "INS-002",
      project: "KWT Phase 2",
      status: "Failed",
      date: "2025-11-14",
      inspector: "Atharva Mane",
    },
    {
      id: "INS-003",
      project: "KBT",
      status: "Passed",
      date: "2025-11-13",
      inspector: "Aryan Patil",
    },
    {
      id: "INS-004",
      project: "Kohinoor Reina",
      status: "Pending",
      date: "2025-11-13",
      inspector: "Atharva Mane",
    },
    {
      id: "INS-005",
      project: "KWT Mundhwa",
      status: "Passed",
      date: "2025-11-12",
      inspector: "Prasad Kulkarni",
    },
  ];

  const activeProjects = [
    {
      name: "Kohinoor Reina",
      completion: 78,
      inspections: 45,
      issues: 8,
    },
    {
      name: "KWT Phase 2",
      completion: 62,
      inspections: 38,
      issues: 12,
    },
    {
      name: "KBT",
      completion: 91,
      inspections: 52,
      issues: 3,
    },
    {
      name: "KWT Mundhwa",
      completion: 45,
      inspections: 21,
      issues: 15,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>
                  <p className="text-slate-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-600" />
                    )}
                    <span className="text-xs text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`${stat.bgColor} p-3 rounded-lg`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeProjects.map((project) => (
              <div key={project.name}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-slate-900">
                      {project.name}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {project.inspections} inspections •{" "}
                      {project.issues} open issues
                    </p>
                  </div>
                  <span className="text-slate-900">
                    {project.completion}%
                  </span>
                </div>
                <Progress
                  value={project.completion}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-900">
                      {inspection.id}
                    </span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(
                        inspection.status,
                      )}
                    >
                      {inspection.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {inspection.project}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-900">
                    {inspection.inspector}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {inspection.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}