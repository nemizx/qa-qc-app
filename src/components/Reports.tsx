import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { generateReportPDF } from '../utils/pdfExport';

export function Reports() {
  const inspectionTrend = [
    { month: 'Jun', passed: 32, failed: 5, pending: 3 },
    { month: 'Jul', passed: 38, failed: 4, pending: 2 },
    { month: 'Aug', passed: 42, failed: 6, pending: 4 },
    { month: 'Sep', passed: 45, failed: 3, pending: 2 },
    { month: 'Oct', passed: 48, failed: 4, pending: 3 },
    { month: 'Nov', passed: 52, failed: 2, pending: 1 },
  ];

  const issuesBySeverity = [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'High', value: 12, color: '#f97316' },
    { name: 'Medium', value: 18, color: '#f59e0b' },
    { name: 'Low', value: 8, color: '#3b82f6' },
  ];

  const projectPerformance = [
    { project: 'Industrial Complex', score: 92 },
    { project: 'Commercial Tower', score: 85 },
    { project: 'Residential Dev', score: 94 },
    { project: 'Infrastructure', score: 78 },
  ];

  const inspectionTypes = [
    { type: 'Concrete', count: 42, passed: 38 },
    { type: 'Steel', count: 28, passed: 25 },
    { type: 'Electrical', count: 35, passed: 33 },
    { type: 'MEP', count: 31, passed: 28 },
    { type: 'Safety', count: 20, passed: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="p1">Industrial Complex Phase 1</SelectItem>
              <SelectItem value="p2">Commercial Tower Downtown</SelectItem>
              <SelectItem value="p3">Residential Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="gap-2"
          onClick={() => generateReportPDF({
            period: 'Last 30 days',
            totalInspections: 156,
            passedInspections: 142,
            failedInspections: 14,
            passRate: '91.2%',
            openIssues: 23,
            criticalIssues: 5,
            projectPerformance: projectPerformance
          })}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Overall Pass Rate</p>
                <p className="text-slate-900 mt-2">91.2%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+3.5%</span>
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              </div>
              <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-green-600">91%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-500">Total Inspections</p>
              <p className="text-slate-900 mt-2">156</p>
              <p className="text-xs text-slate-600 mt-2">
                142 Passed • 14 Failed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-500">Active Issues</p>
              <p className="text-slate-900 mt-2">23</p>
              <p className="text-xs text-slate-600 mt-2">
                5 Critical • 12 High • 6 Medium
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspection Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inspectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="passed" fill="#22c55e" name="Passed" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Issues by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issuesBySeverity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issuesBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Project Performance Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                <YAxis dataKey="project" type="category" stroke="#64748b" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inspection Types */}
        <Card>
          <CardHeader>
            <CardTitle>Inspections by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspectionTypes.map((item) => {
                const passRate = ((item.passed / item.count) * 100).toFixed(1);
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-900">{item.type}</span>
                        <span className="text-sm text-slate-500">
                          {item.passed}/{item.count}
                        </span>
                      </div>
                      <span className="text-sm text-slate-900">{passRate}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
