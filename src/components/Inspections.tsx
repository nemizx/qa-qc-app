import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { PhotoUpload } from './PhotoUpload';
import { Plus, Search, Filter, Download, Eye, ArrowUpDown, X } from 'lucide-react';
import { generateInspectionPDF } from '../utils/pdfExport';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function Inspections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const inspections = [
    {
      id: 'INS-001',
      project: 'Kohinoor Reina',
      location: 'Building A - Foundation',
      type: 'Concrete Quality',
      status: 'Passed',
      date: '2025-11-14',
      inspector: 'Atharva Mane',
      score: 95,
      items: 24,
      passed: 24,
      failed: 0,
      checklistItems: [
        { id: 1, item: 'Concrete mix design approved', checked: true },
        { id: 2, item: 'Formwork alignment verified', checked: true },
        { id: 3, item: 'Rebar spacing and coverage confirmed', checked: true },
        { id: 4, item: 'Concrete slump test completed', checked: true },
        { id: 5, item: 'Temperature monitoring in place', checked: true },
        { id: 6, item: 'Curing method approved', checked: true },
      ]
    },
    {
      id: 'INS-002',
      project: 'KWT Phase 2',
      location: 'Building B - Floor 5',
      type: 'Structural Steel',
      status: 'Failed',
      date: '2025-11-14',
      inspector: 'Aryan Patil',
      score: 72,
      items: 18,
      passed: 13,
      failed: 5,
      checklistItems: [
        { id: 1, item: 'Steel grade verification', checked: true },
        { id: 2, item: 'Welding quality inspection', checked: false },
        { id: 3, item: 'Bolt torque verification', checked: true },
        { id: 4, item: 'Alignment checks', checked: false },
      ]
    },
    {
      id: 'INS-003',
      project: 'KBT',
      location: 'Site C - Unit 102',
      type: 'Electrical Rough-in',
      status: 'Passed',
      date: '2025-11-13',
      inspector: 'Prasad Kulkarni',
      score: 98,
      items: 32,
      passed: 32,
      failed: 0,
      checklistItems: [
        { id: 1, item: 'Conduit installation', checked: true },
        { id: 2, item: 'Wire sizing verification', checked: true },
        { id: 3, item: 'Box placement', checked: true },
      ]
    },
    {
      id: 'INS-004',
      project: 'Kohinoor Reina',
      location: 'Building A - Level 2',
      type: 'MEP Installation',
      status: 'Pending',
      date: '2025-11-13',
      inspector: 'Atharva Mane',
      score: null,
      items: 28,
      passed: 0,
      failed: 0,
      checklistItems: []
    },
    {
      id: 'INS-005',
      project: 'KWT Mundhwa',
      location: 'Building D - Foundation',
      type: 'Concrete Pour',
      status: 'Passed',
      date: '2025-11-12',
      inspector: 'Aryan Patil',
      score: 91,
      items: 20,
      passed: 19,
      failed: 1,
      checklistItems: [
        { id: 1, item: 'Pour sequence approved', checked: true },
        { id: 2, item: 'Vibration equipment ready', checked: true },
        { id: 3, item: 'Test cylinders prepared', checked: false },
      ]
    },
  ];

  // Filter and sort inspections
  const filteredInspections = useMemo(() => {
    let result = inspections;

    // Search filter
    if (searchQuery) {
      result = result.filter(inspection =>
        inspection.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Project filter
    if (filterProject !== 'all') {
      result = result.filter(inspection => inspection.project === filterProject);
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(inspection => inspection.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(inspection => inspection.type === filterType);
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [inspections, searchQuery, filterProject, filterStatus, filterType, sortBy, sortOrder]);

  const projects = Array.from(new Set(inspections.map(i => i.project)));
  const types = Array.from(new Set(inspections.map(i => i.type)));
  const statuses = Array.from(new Set(inspections.map(i => i.status)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterProject('all');
    setFilterStatus('all');
    setFilterType('all');
  };

  const activeFiltersCount = [filterProject, filterStatus, filterType].filter(f => f !== 'all').length;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search inspections..." 
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
                  <Label className="text-xs">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="score">Sort by Score</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
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
              New Inspection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Inspection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
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
                  <Label>Inspection Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
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
                <Label>Inspector</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="i1">Prasad Kulkarni</SelectItem>
                    <SelectItem value="i2">Atharva Mane</SelectItem>
                    <SelectItem value="i3">Aryan Patil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Additional inspection notes..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Photos</Label>
                <PhotoUpload entityType="inspection" entityId="new" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Create Inspection</Button>
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
          {filterStatus !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filterStatus}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterStatus('all')} />
            </Badge>
          )}
          {filterType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filterType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilterType('all')} />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredInspections.length} of {inspections.length} inspections
      </div>

      {/* Inspections List */}
      <div className="grid gap-4">
        {filteredInspections.map((inspection) => (
          <Card key={inspection.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-slate-900">{inspection.id}</span>
                    <Badge variant="outline" className={getStatusColor(inspection.status)}>
                      {inspection.status}
                    </Badge>
                    {inspection.score !== null && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Score: {inspection.score}%
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-slate-900 mb-1">{inspection.project}</h3>
                  <p className="text-sm text-slate-600 mb-3">{inspection.location}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-500">Type: </span>
                      <span className="text-slate-900">{inspection.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Inspector: </span>
                      <span className="text-slate-900">{inspection.inspector}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date: </span>
                      <span className="text-slate-900">{inspection.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Items: </span>
                      <span className="text-green-600">{inspection.passed} passed</span>
                      {inspection.failed > 0 && (
                        <span className="text-red-600"> / {inspection.failed} failed</span>
                      )}
                      <span className="text-slate-500"> of {inspection.items}</span>
                    </div>
                  </div>
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
                        <DialogTitle>Inspection Details - {inspection.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-500">Project</p>
                            <p className="text-slate-900 mt-1">{inspection.project}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Location</p>
                            <p className="text-slate-900 mt-1">{inspection.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Type</p>
                            <p className="text-slate-900 mt-1">{inspection.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Inspector</p>
                            <p className="text-slate-900 mt-1">{inspection.inspector}</p>
                          </div>
                        </div>
                        
                        {inspection.checklistItems.length > 0 && (
                          <div>
                            <h4 className="text-slate-900 mb-4">Checklist Items</h4>
                            <div className="space-y-3">
                              {inspection.checklistItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                  <Checkbox checked={item.checked} />
                                  <span className="text-slate-900">{item.item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-slate-900 mb-4">Photos</h4>
                          <PhotoUpload entityType="inspection" entityId={inspection.id} />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => generateInspectionPDF(inspection)}
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInspections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">No inspections found matching your filters.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}