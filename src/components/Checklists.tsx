import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Eye, Send, CheckCircle, XCircle, Camera, Upload } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-947de7aa`;

export function Checklists() {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [formats, setFormats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock current user - in a real app, this would come from auth
  const currentUserId = 'user_1'; // Prasad Kulkarni

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [checklistsRes, projectsRes, formatsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/checklists`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }),
        fetch(`${API_URL}/projects`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }),
        fetch(`${API_URL}/formats`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }),
        fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }),
      ]);

      const checklistsData = await checklistsRes.json();
      const projectsData = await projectsRes.json();
      const formatsData = await formatsRes.json();
      const usersData = await usersRes.json();

      setChecklists(checklistsData.checklists || []);
      setProjects(projectsData.projects || []);
      setFormats(formatsData.formats || []);
      setUsers(usersData.users || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    }
  };

  const createChecklist = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checklists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ ...data, makerId: currentUserId })
      });

      if (!response.ok) throw new Error('Failed to create checklist');

      toast.success('Checklist created successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to create checklist:', error);
      toast.error('Failed to create checklist');
    } finally {
      setLoading(false);
    }
  };

  const submitChecklist = async (id: string, checkerId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checklists/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ checkerId })
      });

      if (!response.ok) throw new Error('Failed to submit checklist');

      toast.success('Checklist submitted for checking');
      await loadData();
    } catch (error) {
      console.error('Failed to submit checklist:', error);
      toast.error('Failed to submit checklist');
    } finally {
      setLoading(false);
    }
  };

  const checkChecklist = async (id: string, items: any[], status: string, comments: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checklists/${id}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ checkerId: currentUserId, items, status, comments })
      });

      if (!response.ok) throw new Error('Failed to check checklist');

      toast.success(`Checklist ${status === 'Approved' ? 'approved' : 'rejected'}`);
      await loadData();
    } catch (error) {
      console.error('Failed to check checklist:', error);
      toast.error('Failed to check checklist');
    } finally {
      setLoading(false);
    }
  };

  const submitForApproval = async (id: string, approverId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checklists/${id}/submit-approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ approverId })
      });

      if (!response.ok) throw new Error('Failed to submit for approval');

      toast.success('Checklist submitted for approval');
      await loadData();
    } catch (error) {
      console.error('Failed to submit for approval:', error);
      toast.error('Failed to submit for approval');
    } finally {
      setLoading(false);
    }
  };

  const approveChecklist = async (id: string, status: string, comments: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checklists/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ approverId: currentUserId, status, comments })
      });

      if (!response.ok) throw new Error('Failed to approve checklist');

      toast.success(`Checklist ${status === 'Approved' ? 'approved' : 'rejected'}`);
      await loadData();
    } catch (error) {
      console.error('Failed to approve checklist:', error);
      toast.error('Failed to approve checklist');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (checklistId: string, itemIndex: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'checklist');
      formData.append('entityId', checklistId);
      formData.append('itemIndex', itemIndex.toString());

      const response = await fetch(`${API_URL}/photos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload photo');

      const data = await response.json();
      toast.success('Photo uploaded successfully');
      return data.url;
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error('Failed to upload photo');
      return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Checking': return 'bg-amber-100 text-amber-800';
      case 'Checked': return 'bg-green-100 text-green-800';
      case 'Approving': return 'bg-purple-100 text-purple-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredChecklists = checklists.filter(cl => {
    if (activeTab === 'all') return true;
    if (activeTab === 'my-drafts') return cl.status === 'Draft' && cl.makerId === currentUserId;
    if (activeTab === 'to-check') return cl.status === 'Submitted' && cl.checkerId === currentUserId;
    if (activeTab === 'to-approve') return cl.status === 'Checked' && cl.approverId === currentUserId;
    if (activeTab === 'approved') return cl.status === 'Approved';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Checklists (Maker-Checker-Approver)</h2>
          <p className="text-sm text-slate-500 mt-1">Create, review, and approve quality checklists</p>
        </div>
        <NewChecklistDialog
          onCreate={createChecklist}
          projects={projects}
          formats={formats}
          loading={loading}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Checklists</TabsTrigger>
          <TabsTrigger value="my-drafts">My Drafts</TabsTrigger>
          <TabsTrigger value="to-check">To Check</TabsTrigger>
          <TabsTrigger value="to-approve">To Approve</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredChecklists.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500">No checklists found</p>
              </CardContent>
            </Card>
          ) : (
            filteredChecklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                projects={projects}
                formats={formats}
                users={users}
                currentUserId={currentUserId}
                onSubmit={submitChecklist}
                onCheck={checkChecklist}
                onSubmitApproval={submitForApproval}
                onApprove={approveChecklist}
                onUploadPhoto={uploadPhoto}
                loading={loading}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChecklistCard({
  checklist,
  projects,
  formats,
  users,
  currentUserId,
  onSubmit,
  onCheck,
  onSubmitApproval,
  onApprove,
  onUploadPhoto,
  loading
}: any) {
  const [viewOpen, setViewOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  const project = projects.find((p: any) => p.id === checklist.projectId);
  const format = formats.find((f: any) => f.id === checklist.formatId);
  const maker = users.find((u: any) => u.id === checklist.makerId);
  const checker = users.find((u: any) => u.id === checklist.checkerId);
  const approver = users.find((u: any) => u.id === checklist.approverId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Checking': return 'bg-amber-100 text-amber-800';
      case 'Checked': return 'bg-green-100 text-green-800';
      case 'Approving': return 'bg-purple-100 text-purple-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-slate-900">{checklist.id}</span>
              <Badge variant="outline" className={getStatusColor(checklist.status)}>
                {checklist.status}
              </Badge>
            </div>
            <h3 className="text-slate-900 mb-1">{project?.name || 'Unknown Project'}</h3>
            <p className="text-sm text-slate-600 mb-3">{checklist.location}</p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-slate-500">Format: </span>
                <span className="text-slate-900">{format?.name || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-slate-500">Maker: </span>
                <span className="text-slate-900">{maker?.name || 'Unknown'}</span>
              </div>
              {checker && (
                <div>
                  <span className="text-slate-500">Checker: </span>
                  <span className="text-slate-900">{checker.name}</span>
                </div>
              )}
              {approver && (
                <div>
                  <span className="text-slate-500">Approver: </span>
                  <span className="text-slate-900">{approver.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Checklist Details - {checklist.id}</DialogTitle>
                </DialogHeader>
                <ChecklistDetails
                  checklist={checklist}
                  project={project}
                  format={format}
                  maker={maker}
                  checker={checker}
                  approver={approver}
                  onUploadPhoto={onUploadPhoto}
                />
              </DialogContent>
            </Dialog>

            {checklist.status === 'Draft' && checklist.makerId === currentUserId && (
              <SubmitChecklistDialog
                checklistId={checklist.id}
                users={users}
                onSubmit={onSubmit}
                loading={loading}
              />
            )}

            {checklist.status === 'Submitted' && checklist.checkerId === currentUserId && (
              <CheckChecklistDialog
                checklist={checklist}
                onCheck={onCheck}
                loading={loading}
              />
            )}

            {checklist.status === 'Checked' && checklist.checkerId === currentUserId && (
              <SubmitApprovalDialog
                checklistId={checklist.id}
                users={users}
                onSubmit={onSubmitApproval}
                loading={loading}
              />
            )}

            {checklist.status === 'Approving' && checklist.approverId === currentUserId && (
              <ApproveChecklistDialog
                checklist={checklist}
                onApprove={onApprove}
                loading={loading}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistDetails({ checklist, project, format, maker, checker, approver, onUploadPhoto }: any) {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500">Project</p>
          <p className="text-slate-900 mt-1">{project?.name || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Location</p>
          <p className="text-slate-900 mt-1">{checklist.location}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Format</p>
          <p className="text-slate-900 mt-1">{format?.name || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Status</p>
          <Badge className="mt-1">{checklist.status}</Badge>
        </div>
      </div>

      <div>
        <h4 className="text-slate-900 mb-4">Checklist Items</h4>
        <div className="space-y-3">
          {checklist.items?.map((item: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox checked={item.checked} />
                <div className="flex-1">
                  <p className="text-slate-900">{item.text}</p>
                  {item.photoUrl && (
                    <img src={item.photoUrl} alt="Item photo" className="mt-2 max-w-xs rounded-lg" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {checklist.checkerComments && (
        <div>
          <h4 className="text-slate-900 mb-2">Checker Comments</h4>
          <p className="text-sm text-slate-600 p-3 bg-amber-50 rounded-lg">{checklist.checkerComments}</p>
        </div>
      )}

      {checklist.approverComments && (
        <div>
          <h4 className="text-slate-900 mb-2">Approver Comments</h4>
          <p className="text-sm text-slate-600 p-3 bg-green-50 rounded-lg">{checklist.approverComments}</p>
        </div>
      )}
    </div>
  );
}

function NewChecklistDialog({ onCreate, projects, formats, loading }: any) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [formatId, setFormatId] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const handleFormatChange = (newFormatId: string) => {
    setFormatId(newFormatId);
    const format = formats.find((f: any) => f.id === newFormatId);
    if (format) {
      setItems(format.items.map((text: string) => ({ text, checked: false, photoUrl: null })));
    }
  };

  const handleSubmit = () => {
    if (!projectId || !formatId || !location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    onCreate({ projectId, formatId, location, items });
    setOpen(false);
    setProjectId('');
    setFormatId('');
    setLocation('');
    setItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Checklist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Checklist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={formatId} onValueChange={handleFormatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format: any) => (
                  <SelectItem key={format.id} value={format.id}>{format.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Building A - Level 2"
            />
          </div>
          {items.length > 0 && (
            <div className="space-y-2">
              <Label>Preview Checklist Items</Label>
              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="text-sm text-slate-600">• {item.text}</div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>Create Checklist</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubmitChecklistDialog({ checklistId, users, onSubmit, loading }: any) {
  const [open, setOpen] = useState(false);
  const [checkerId, setCheckerId] = useState('');

  const handleSubmit = () => {
    if (!checkerId) {
      toast.error('Please select a checker');
      return;
    }
    onSubmit(checklistId, checkerId);
    setOpen(false);
    setCheckerId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit for Checking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Select Checker</Label>
            <Select value={checkerId} onValueChange={setCheckerId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a checker" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckChecklistDialog({ checklist, onCheck, loading }: any) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [items, setItems] = useState(checklist.items || []);

  const handleApprove = () => {
    onCheck(checklist.id, items, 'Approved', comments);
    setOpen(false);
  };

  const handleReject = () => {
    if (!comments.trim()) {
      toast.error('Please provide comments for rejection');
      return;
    }
    onCheck(checklist.id, items, 'Rejected', comments);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Checklist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) => {
                      const newItems = [...items];
                      newItems[idx].checked = checked;
                      setItems(newItems);
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-slate-900">{item.text}</p>
                    {item.photoUrl && (
                      <img src={item.photoUrl} alt="Item" className="mt-2 max-w-xs rounded-lg" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your review comments..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubmitApprovalDialog({ checklistId, users, onSubmit, loading }: any) {
  const [open, setOpen] = useState(false);
  const [approverId, setApproverId] = useState('');

  const handleSubmit = () => {
    if (!approverId) {
      toast.error('Please select an approver');
      return;
    }
    onSubmit(checklistId, approverId);
    setOpen(false);
    setApproverId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          Send to Approver
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit for Approval</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Select Approver</Label>
            <Select value={approverId} onValueChange={setApproverId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an approver" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ApproveChecklistDialog({ checklist, onApprove, loading }: any) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState('');

  const handleApprove = () => {
    onApprove(checklist.id, 'Approved', comments);
    setOpen(false);
  };

  const handleReject = () => {
    if (!comments.trim()) {
      toast.error('Please provide comments for rejection');
      return;
    }
    onApprove(checklist.id, 'Rejected', comments);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Final Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Final Approval</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Approver Comments</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your approval comments..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
