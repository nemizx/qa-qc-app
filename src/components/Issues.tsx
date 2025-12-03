import { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PhotoUpload } from './PhotoUpload';
import { Plus, Search, Filter, AlertTriangle, Camera, MessageSquare, Download, ArrowUpDown, X, Eye } from 'lucide-react';
import { generateIssuePDF } from '../utils/pdfExport';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function Issues() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'dueDate'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const issues = [
    {
      id: 'ISS-001',
      title: 'Concrete surface cracking detected',
      project: 'Kohinoor Reina',
      location: 'Building A - Foundation',
      severity: 'Critical',
      status: 'Open',
      assignee: 'Atharva Mane',
      reportedBy: 'Aryan Patil',
      date: '2025-11-14',
      dueDate: '2025-11-16',
      description: 'Multiple hairline cracks observed in the foundation slab. Cracks range from 0.5mm to 2mm in width and extend up to 1.5 meters in length.',
      photos: 3,
      comments: 5
    },
    {
      id: 'ISS-002',
      title: 'Rebar spacing non-compliant',
      project: 'KWT Phase 2',
      location: 'Building B - Floor 5',
      severity: 'High',
      status: 'In Progress',
      assignee: 'Prasad Kulkarni',
      reportedBy: 'Atharva Mane',
      date: '2025-11-13',
      dueDate: '2025-11-15',
      description: 'Rebar spacing exceeds design specifications in grid lines D-F. Measured spacing is 350mm instead of specified 300mm.',
      photos: 2,
      comments: 3
    },
    {
      id: 'ISS-003',
      title: 'Electrical conduit misalignment',
      project: 'KBT',
      location: 'Site C - Unit 102',
      severity: 'Medium',
      status: 'Resolved',
      assignee: 'Aryan Patil',
      reportedBy: 'Prasad Kulkarni',
      date: '2025-11-12',
      dueDate: '2025-11-14',
      description: 'Conduit runs not aligned with architectural plans. Requires rework in kitchen and bathroom areas.',
      photos: 1,
      comments: 7
    },
    {
      id: 'ISS-004',
      title: 'HVAC duct support inadequate',
      project: 'Kohinoor Reina',
      location: 'Building A - Level 2',
      severity: 'High',
      status: 'Open',
      assignee: 'Atharva Mane',
      reportedBy: 'Aryan Patil',
      date: '2025-11-11',
      dueDate: '2025-11-17',
      description: 'Additional hangers required per code requirements. Current spacing exceeds maximum allowed span.',
      photos: 4,
      comments: 2
    },
    {
      id: 'ISS-005',
      title: 'Waterproofing membrane damage',
      project: 'KWT Phase 2',
      location: 'Building B - Basement',
      severity: 'Critical',
      status: 'In Progress',
      assignee: 'Prasad Kulkarni',
      reportedBy: 'Atharva Mane',
      date: '2025-11-10',
      dueDate: '2025-11-15',
      description: 'Membrane punctured during installation work. Multiple penetrations found requiring immediate repair.',
      photos: 5,
      comments: 8
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const severityWeight = (severity: string) => {
    switch (severity) {
      case 'Critical': return 4;
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  // Filter and sort issues
  const filteredIssues = useMemo(() => {
    let result = issues;

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter(issue => 
        issue.status.toLowerCase().replace(' ', '-') === activeTab
      );
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(issue =>
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Project filter
    if (filterProject !== 'all') {
      result = result.filter(issue => issue.project === filterProject);
    }

    // Severity filter
    if (filterSeverity !== 'all') {
      result = result.filter(issue => issue.severity === filterSeverity);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'severity':
          comparison = severityWeight(a.severity) - severityWeight(b.severity);
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [issues, activeTab, searchQuery, filterProject, filterSeverity, sortBy, sortOrder]);

  const projects = Array.from(new Set(issues.map(i => i.project)));
  const severities = ['Critical', 'High', 'Medium', 'Low'];

  const clearFilters = () => {
    setSearchQuery('');
    setFilterProject('all');
    setFilterSeverity('all');
  };

  const activeFiltersCount = [filterProject, filterSeverity].filter(f => f !== 'all').length;

  const issuesByStatus = {
    all: issues.length,
    open: issues.filter(i => i.status === 'Open').length,
    'in-progress': issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search issues..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm">Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs">
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Project</Label>
                  <Select value={filterProject} onValueChange={setFilterProject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project} value={project}>{project}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Severity</Label>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      {severities.map(severity => (
                        <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="severity">Sort by Severity</SelectItem>
              <SelectItem value="dueDate">Sort by Due Date</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report New Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Issue Title</Label>
                <Input placeholder="Brief description of the issue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project} value={project}>{project}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severities.map(severity => (
                        <SelectItem key={severity} value={severity.toLowerCase()}>{severity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Building A - Level 2" />
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="i1">Prasad Kulkarni</SelectItem>
                    <SelectItem value="i2">Atharva Mane</SelectItem>
                    <SelectItem value="i3">Aryan Patil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the issue..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Photos</Label>
                <PhotoUpload entityType="issue" entityId="new" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Report Issue</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">Active filters:</span>
          {filterProject !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Project: {filterProject}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterProject('all')} />
            </Badge>
          )}
          {filterSeverity !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Severity: {filterSeverity}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterSeverity('all')} />
            </Badge>
          )}
        </div>
      )}

      {/* Issues Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Issues ({issuesByStatus.all})</TabsTrigger>
          <TabsTrigger value="open">
            Open ({issuesByStatus.open})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({issuesByStatus['in-progress']})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({issuesByStatus.resolved})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Results Count */}
          <div className="text-sm text-slate-600 mb-4">
            Showing {filteredIssues.length} of {activeTab === 'all' ? issues.length : issuesByStatus[activeTab as keyof typeof issuesByStatus]} issues
          </div>

          <div className="grid gap-4">
            {filteredIssues.map((issue: any) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getSeverityColor(issue.severity)}`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-slate-900">{issue.id}</span>
                          <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Issue Details - {issue.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-slate-500">Project</p>
                                    <p className="text-slate-900 mt-1">{issue.project}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Location</p>
                                    <p className="text-slate-900 mt-1">{issue.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Severity</p>
                                    <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Status</p>
                                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Assigned To</p>
                                    <p className="text-slate-900 mt-1">{issue.assignee}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Reported By</p>
                                    <p className="text-slate-900 mt-1">{issue.reportedBy}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Reported Date</p>
                                    <p className="text-slate-900 mt-1">{issue.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500">Due Date</p>
                                    <p className="text-slate-900 mt-1">{issue.dueDate}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-slate-900 mb-2">Description</h4>
                                  <p className="text-sm text-slate-600">{issue.description}</p>
                                </div>

                                <div>
                                  <h4 className="text-slate-900 mb-4">Photos</h4>
                                  <PhotoUpload entityType="issue" entityId={issue.id} />
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => generateIssuePDF(issue)}
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-slate-900 mb-2">{issue.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                      <div className="flex items-center gap-6 text-sm mb-3 flex-wrap">
                        <div>
                          <span className="text-slate-500">Project: </span>
                          <span className="text-slate-900">{issue.project}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Location: </span>
                          <span className="text-slate-900">{issue.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm flex-wrap gap-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-slate-500">Assigned to: </span>
                            <span className="text-slate-900">{issue.assignee}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Reported: </span>
                            <span className="text-slate-900">{issue.date}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Due: </span>
                            <span className="text-slate-900">{issue.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Camera className="h-4 w-4" />
                            <span>{issue.photos}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{issue.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500">No issues found matching your filters.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}