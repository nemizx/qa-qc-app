import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit, Trash2, Building2, Users, FileText, Activity } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-947de7aa`;

export function Admin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formats, setFormats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data
  const loadProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    }
  };

  const loadFormats = async () => {
    try {
      const response = await fetch(`${API_URL}/formats`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setFormats(data.formats || []);
    } catch (error) {
      console.error('Failed to load formats:', error);
      toast.error('Failed to load formats');
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/activities?limit=50`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
      toast.error('Failed to load activities');
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
    loadFormats();
    loadActivities();
  }, []);

  // Project management
  const createProject = async (name: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ name, status: 'Active' })
      });
      
      if (!response.ok) throw new Error('Failed to create project');
      
      toast.success('Project created successfully');
      await loadProjects();
      await loadActivities();
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete project');
      
      toast.success('Project deleted successfully');
      await loadProjects();
      await loadActivities();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  // User management
  const createUser = async (name: string, email: string, role: string, title: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ name, email, role, title })
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      
      toast.success('User created successfully');
      await loadUsers();
      await loadActivities();
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      toast.success('User deleted successfully');
      await loadUsers();
      await loadActivities();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Format management
  const createFormat = async (name: string, category: string, items: string[]) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/formats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ name, category, items })
      });
      
      if (!response.ok) throw new Error('Failed to create format');
      
      toast.success('Format created successfully');
      await loadFormats();
      await loadActivities();
    } catch (error) {
      console.error('Failed to create format:', error);
      toast.error('Failed to create format');
    } finally {
      setLoading(false);
    }
  };

  const deleteFormat = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/formats/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete format');
      
      toast.success('Format deleted successfully');
      await loadFormats();
      await loadActivities();
    } catch (error) {
      console.error('Failed to delete format:', error);
      toast.error('Failed to delete format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900">Admin Panel</h2>
        <p className="text-sm text-slate-500 mt-1">Manage projects, users, formats, and view activity logs</p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects" className="gap-2">
            <Building2 className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="formats" className="gap-2">
            <FileText className="h-4 w-4" />
            Formats
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Management</CardTitle>
                <NewProjectDialog onCreate={createProject} loading={loading} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.completion}%</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <NewUserDialog onCreate={createUser} loading={loading} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="text-sm text-slate-500">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.title}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formats Tab */}
        <TabsContent value="formats" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Format Definitions</CardTitle>
                <NewFormatDialog onCreate={createFormat} loading={loading} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formats.map((format) => (
                  <Card key={format.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-slate-900">{format.name}</h4>
                            <Badge variant="outline">{format.category}</Badge>
                          </div>
                          <div className="text-sm text-slate-600">
                            <p className="mb-2">Checklist items:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {format.items?.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFormat(format.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.action}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-900">{activity.details}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Entity: {activity.entityType} ({activity.entityId})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dialog components
function NewProjectDialog({ onCreate, loading }: { onCreate: (name: string) => void; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    onCreate(name);
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>Create Project</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewUserDialog({ onCreate, loading }: { onCreate: (name: string, email: string, role: string, title: string) => void; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Inspector');
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !title.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    onCreate(name, email, role, title);
    setName('');
    setEmail('');
    setRole('Inspector');
    setTitle('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Inspector">Inspector</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., QA Engineer"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>Create User</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NewFormatDialog({ onCreate, loading }: { onCreate: (name: string, category: string, items: string[]) => void; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Structural');
  const [itemsText, setItemsText] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !itemsText.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    const items = itemsText.split('\n').filter(item => item.trim());
    onCreate(name, category, items);
    setName('');
    setCategory('Structural');
    setItemsText('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Format
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Format</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Format Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Concrete Quality Inspection"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Structural">Structural</SelectItem>
                <SelectItem value="MEP">MEP</SelectItem>
                <SelectItem value="Architectural">Architectural</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Checklist Items (one per line)</Label>
            <textarea
              className="w-full min-h-[150px] p-2 border rounded-md"
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Enter each checklist item on a new line"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>Create Format</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
