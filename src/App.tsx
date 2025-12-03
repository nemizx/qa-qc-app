import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Inspections } from './components/Inspections';
import { Issues } from './components/Issues';
import { Reports } from './components/Reports';
import { Admin } from './components/Admin';
import { Checklists } from './components/Checklists';
import { ClipboardCheck, AlertTriangle, BarChart3, LayoutDashboard, Settings, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-900">QA/QC Management System</h1>
              <p className="text-slate-500 text-sm mt-1">Construction Quality Control & Assurance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-900">Prasad Kulkarni</p>
                <p className="text-xs text-slate-500">Head of QA</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                PK
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="checklists" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Checklists
            </TabsTrigger>
            <TabsTrigger value="inspections" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="checklists">
            <Checklists />
          </TabsContent>

          <TabsContent value="inspections">
            <Inspections />
          </TabsContent>

          <TabsContent value="issues">
            <Issues />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="admin">
            <Admin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}