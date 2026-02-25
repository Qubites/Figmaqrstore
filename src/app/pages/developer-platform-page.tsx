import React, { useState } from "react";
import { 
  Search, Bell, Terminal, ExternalLink, Shield, Key, RefreshCw, 
  Trash2, Plus, Eye, CheckCircle2, AlertTriangle, Clock, 
  ChevronRight, Copy, Check, Info, Lock, Play, Globe,
  LayoutDashboard, FileText, Settings, Users, ArrowRight,
  Code, Database, Webhook, Zap, Activity, AlertCircle,
  MoreHorizontal, RotateCcw, XCircle, LogOut, Moon, Sun,
  Smartphone, Monitor, Laptop, Menu, ChevronDown, Filter
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { cn } from "../components/ui/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Checkbox } from "../components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

// --- Types ---

type AppStatus = 'active' | 'revoked' | 'rotated';
type Env = 'live' | 'test';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  status: AppStatus;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'failing' | 'disabled';
  lastDelivery: string | null;
}

interface ActivityEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  refId: string;
  severity?: 'info' | 'warning' | 'critical';
}

// --- Mock Data ---

const MOCK_KEYS: ApiKey[] = [
  { id: 'key_1', name: 'Mobile App Prod', prefix: 'pk_live_...', created: '2023-10-15', lastUsed: '2 mins ago', status: 'active' },
  { id: 'key_2', name: 'Backend Service', prefix: 'sk_live_...', created: '2023-09-01', lastUsed: '1 hour ago', status: 'active' },
  { id: 'key_3', name: 'Legacy Key', prefix: 'pk_live_...', created: '2022-05-20', lastUsed: '30 days ago', status: 'revoked' },
];

const MOCK_WEBHOOKS: WebhookEndpoint[] = [
  { id: 'wh_1', url: 'https://api.merchant.com/webhooks', events: ['payment.success', 'payment.failed'], status: 'active', lastDelivery: 'Success (200 OK)' },
  { id: 'wh_2', url: 'https://staging.merchant.com/events', events: ['all'], status: 'failing', lastDelivery: 'Failed (500)' },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'evt_1', action: 'Key Rotated', actor: 'Admin (Jane)', timestamp: 'Today, 10:42 AM', refId: 'key_2', severity: 'warning' },
  { id: 'evt_2', action: 'Webhook Added', actor: 'Dev (Mike)', timestamp: 'Yesterday, 4:15 PM', refId: 'wh_1', severity: 'info' },
  { id: 'evt_3', action: 'Key Created', actor: 'Admin (Jane)', timestamp: 'Oct 15, 2023', refId: 'key_1', severity: 'info' },
];

// --- 1. Shared Components ---

function DeveloperLoginPanel() {
  return (
    <Card className="w-full max-w-sm mx-auto shadow-none border-border">
      <CardHeader>
        <CardTitle className="text-xl">Sign in to Dashboard</CardTitle>
        <CardDescription>Access your API keys and integration settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input placeholder="name@company.com" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-sm font-medium">Password</label>
             <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
          </div>
          <Input type="password" />
        </div>
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  );
}

function DeveloperConnectWizard() {
  const [step, setStep] = useState(1);
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
       {/* Stepper */}
       <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10" />
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white transition-colors", 
              step >= s ? "border-primary text-primary" : "border-gray-200 text-gray-400"
            )}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
       </div>

       <Card>
         <CardHeader>
           <CardTitle>
             {step === 1 && "Create Application"}
             {step === 2 && "Choose Scopes"}
             {step === 3 && "Configure Webhooks"}
             {step === 4 && "Get Keys"}
           </CardTitle>
           <CardDescription>Step {step} of 4</CardDescription>
         </CardHeader>
         <CardContent className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg m-6 bg-gray-50/50">
            <p className="text-muted-foreground text-sm">Wizard Content Placeholder</p>
         </CardContent>
         <CardFooter className="justify-between border-t pt-6">
           <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</Button>
           <Button onClick={() => setStep(Math.min(4, step + 1))}>{step === 4 ? 'Finish' : 'Next'}</Button>
         </CardFooter>
      </Card>
    </div>
  );
}

function DeveloperWebhookTester() {
  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Webhook Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="flex flex-col sm:flex-row gap-3">
           <Select defaultValue="payment.success">
             <SelectTrigger className="w-[240px] font-mono text-xs"><SelectValue /></SelectTrigger>
             <SelectContent>
               <SelectItem value="payment.success">payment.success</SelectItem>
               <SelectItem value="payment.failed">payment.failed</SelectItem>
               <SelectItem value="refund.created">refund.created</SelectItem>
             </SelectContent>
           </Select>
           <Button variant="secondary" size="sm" className="whitespace-nowrap">Send Test Event</Button>
         </div>
         <div className="border rounded-md bg-slate-50 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b text-xs font-medium text-muted-foreground">
               <span>Recent Deliveries</span>
               <span className="font-mono">POST /webhooks</span>
            </div>
            <div className="p-0">
               <div className="flex items-center justify-between px-3 py-2 border-b last:border-0 bg-white">
                   <div className="flex items-center gap-3">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-mono bg-green-50 text-green-700 border-green-200">200 OK</Badge>
                      <span className="font-mono text-xs text-slate-600">payment.success</span>
                   </div>
                   <span className="text-[10px] text-muted-foreground">Just now</span>
               </div>
               <div className="flex items-center justify-between px-3 py-2 border-b last:border-0 bg-white">
                   <div className="flex items-center gap-3">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-mono bg-red-50 text-red-700 border-red-200">500 ERR</Badge>
                      <span className="font-mono text-xs text-slate-600">payment.failed</span>
                   </div>
                   <span className="text-[10px] text-muted-foreground">2m ago</span>
               </div>
            </div>
         </div>
      </CardContent>
    </Card>
  );
}

function AdminIntegrationPolicyChecklist() {
  const policies = [
    { label: 'TLS 1.2+ Required', status: 'pass', note: 'All traffic encrypted' },
    { label: 'Key Rotation < 90 days', status: 'fail', note: 'Last rotation: 124 days ago' },
    { label: 'Webhook Signature Check', status: 'pass', note: 'Verified via logs' },
    { label: 'Rate Limits Respect', status: 'pass', note: '< 50 req/sec' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
           <Shield className="w-4 h-4" /> Integration Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
         {policies.map((item, i) => (
           <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
             <div className="flex flex-col">
               <span className="text-sm font-medium">{item.label}</span>
               <span className="text-[10px] text-muted-foreground">{item.note}</span>
             </div>
             {item.status === 'pass' ? 
               <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
               <XCircle className="w-4 h-4 text-red-500" />
             }
           </div>
         ))}
      </CardContent>
    </Card>
  );
}

function MerchantRevokeDisableActions({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Revoke API Key</DialogTitle>
          <DialogDescription>
            This action is <span className="font-bold text-foreground">irreversible</span>. Any applications using this key will immediately fail to authenticate.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
           <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-900 text-sm">
             <div className="p-2 bg-white rounded-md shadow-sm border border-red-100"><Key className="w-4 h-4 text-red-500" /></div>
             <div className="flex flex-col">
               <span className="font-semibold">Mobile App Prod</span>
               <span className="font-mono text-xs opacity-80">pk_live_8923...</span>
             </div>
           </div>
           
           <div className="space-y-2">
             <label className="text-xs font-semibold uppercase text-muted-foreground">Type "REVOKE" to confirm</label>
             <Input placeholder="REVOKE" className="font-mono placeholder:font-sans" />
           </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" className="w-full sm:w-auto">Yes, Revoke Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeveloperDocsTopNav() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <span className="font-semibold text-lg tracking-tight">Developers</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Guides</a>
          <a href="#" className="hover:text-primary transition-colors">API Reference</a>
          <a href="#" className="hover:text-primary transition-colors">SDKs</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <DeveloperDocsSearch />
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">JD</div>
          <span className="hidden sm:inline">Jane Doe</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </div>
    </header>
  );
}

function DeveloperDocsSearch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-64 group">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <Input 
        placeholder="Search documentation..." 
        className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-ring transition-all"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      <div className="absolute right-2 top-2 text-[10px] font-mono text-muted-foreground border rounded px-1.5 bg-background">⌘K</div>
      
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
           <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Recent</div>
           <div className="space-y-1">
             <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer text-sm">
               <FileText className="w-4 h-4 text-muted-foreground" />
               <span>Authentication</span>
             </div>
             <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer text-sm">
               <Webhook className="w-4 h-4 text-muted-foreground" />
               <span>Webhooks</span>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

function DeveloperDocsStatusBar({ env = 'live' }: { env?: Env }) {
  return (
    <div className="h-10 bg-muted/30 border-b flex items-center justify-between px-6 text-xs font-mono">
       <div className="flex items-center gap-4">
         <div className="flex items-center gap-2">
           <div className={cn("w-2 h-2 rounded-full animate-pulse", env === 'live' ? "bg-green-500" : "bg-yellow-500")} />
           <span className="uppercase text-muted-foreground font-semibold tracking-wider">{env} Environment</span>
         </div>
         <span className="text-muted-foreground">API Base: https://api.qrstore.app/v1</span>
       </div>
       <div className="flex items-center gap-4 text-muted-foreground">
         <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Systems Operational</span>
         <span>Last synced: 10:42 AM</span>
       </div>
    </div>
  );
}

// --- 2. Merchant Components ---

function MerchantCredentialsCreatePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New API Key</CardTitle>
        <CardDescription>Generate a new key pair for your application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">App Name</label>
          <Input placeholder="e.g. iOS Customer App" />
          <p className="text-[12px] text-muted-foreground">Used to identify this key in logs and webhooks.</p>
        </div>
        <MerchantScopeSelector />
      </CardContent>
      <CardFooter className="justify-end border-t pt-4">
        <Button>Create Credentials</Button>
      </CardFooter>
    </Card>
  );
}

function MerchantScopeSelector() {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Scopes</label>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">Select All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { id: 'payments:read', label: 'Read Payments', desc: 'View payment history' },
          { id: 'payments:write', label: 'Create Payments', desc: 'Initiate new charges' },
          { id: 'refunds:write', label: 'Refunds', desc: 'Issue refunds to customers' },
          { id: 'customers:read', label: 'Read Customers', desc: 'View customer profiles' },
        ].map(scope => (
          <div key={scope.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <Checkbox id={scope.id} />
            <div className="grid gap-0.5">
              <label htmlFor={scope.id} className="text-sm font-medium leading-none cursor-pointer">{scope.label}</label>
              <p className="text-xs text-muted-foreground">{scope.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MerchantAppKeysTable() {
  const [revokeOpen, setRevokeOpen] = useState(false);

  return (
    <>
      <MerchantRevokeDisableActions open={revokeOpen} onOpenChange={setRevokeOpen} />
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>Key Name</TableHead>
              <TableHead className="w-[180px]">Prefix</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_KEYS.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{key.prefix}••••</TableCell>
                <TableCell className="text-sm text-muted-foreground">{key.created}</TableCell>
                <TableCell className="text-sm font-mono">{key.lastUsed}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "font-mono uppercase text-[10px]",
                    key.status === 'active' ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-600"
                  )}>
                    {key.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Copy ID</DropdownMenuItem>
                      <DropdownMenuItem><RotateCcw className="w-4 h-4 mr-2" /> Rotate Key</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onSelect={() => setRevokeOpen(true)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Revoke Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function MerchantRotateSecretDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Rotate Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rotate API Key</DialogTitle>
          <DialogDescription>
             Are you sure you want to rotate this secret key? The old key will expire in 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-sm text-yellow-800 my-2">
           <AlertTriangle className="w-5 h-5 flex-shrink-0" />
           <p>You will need to update your application with the new key immediately to avoid downtime.</p>
        </div>
        <DialogFooter>
           <Button variant="outline">Cancel</Button>
           <Button>Rotate & Show New Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MerchantWebhookManager() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <div>
           <h3 className="text-lg font-medium">Webhooks</h3>
           <p className="text-sm text-muted-foreground">Manage event notifications.</p>
         </div>
         <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Endpoint</Button>
      </div>
      
      <div className="grid gap-4">
        {MOCK_WEBHOOKS.map(wh => (
          <div key={wh.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className="font-mono text-sm font-medium">{wh.url}</span>
                 {wh.status === 'active' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>}
                 {wh.status === 'failing' && <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Failing</Badge>}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                 <span>Events: {wh.events.join(', ')}</span>
                 <span>Last: {wh.lastDelivery}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm">Test</Button>
               <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MerchantKeyActivityFeed() {
  return (
    <div className="space-y-4">
       <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
       <div className="relative pl-6 space-y-6 border-l ml-3">
         {MOCK_ACTIVITY.map((evt, i) => (
           <div key={evt.id} className="relative">
             <div className={cn(
               "absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-200",
               evt.severity === 'warning' ? "bg-amber-400" : "bg-blue-400"
             )} />
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{evt.action}</span>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{evt.refId}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                   <span>{evt.actor}</span>
                   <span>•</span>
                   <span>{evt.timestamp}</span>
                </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}

// --- 3. Admin Components ---

function AdminMerchantKeyOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="text-sm font-medium text-muted-foreground">Active Keys</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">1,284</div>
           <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="text-sm font-medium text-muted-foreground">Rotated (30d)</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">42</div>
           <p className="text-xs text-muted-foreground mt-1">Healthy rotation rate</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="text-sm font-medium text-muted-foreground">Suspicious Events</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold text-amber-600">3</div>
           <p className="text-xs text-muted-foreground mt-1">Needs review</p>
         </CardContent>
       </Card>
    </div>
  );
}

function AdminMerchantKeyActivityPanel() {
  return (
    <div className="rounded-md border bg-white">
      <div className="p-4 border-b flex items-center justify-between">
         <h3 className="font-medium">Global Key Activity</h3>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8"><Filter className="w-3 h-3 mr-2" /> Filter</Button>
            <Button variant="outline" size="sm" className="h-8"><RefreshCw className="w-3 h-3 mr-2" /> Refresh</Button>
         </div>
      </div>
      <Table>
        <TableHeader>
           <TableRow>
             <TableHead>Timestamp</TableHead>
             <TableHead>Merchant</TableHead>
             <TableHead>Action</TableHead>
             <TableHead>Ref ID</TableHead>
             <TableHead>Actor</TableHead>
           </TableRow>
        </TableHeader>
        <TableBody>
           <TableRow>
             <TableCell className="font-mono text-xs text-muted-foreground">10:42:01</TableCell>
             <TableCell>Acme Corp</TableCell>
             <TableCell><Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Rotation Force</Badge></TableCell>
             <TableCell className="font-mono text-xs">key_29a</TableCell>
             <TableCell className="text-muted-foreground">System</TableCell>
           </TableRow>
           <TableRow>
             <TableCell className="font-mono text-xs text-muted-foreground">10:41:55</TableCell>
             <TableCell>Beta Ltd</TableCell>
             <TableCell>Key Created</TableCell>
             <TableCell className="font-mono text-xs">key_31b</TableCell>
             <TableCell className="text-muted-foreground">user_99</TableCell>
           </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function AdminSuspiciousActivityQueue() {
  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Suspicious Activity Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
         <div className="space-y-4">
           {[1, 2].map(i => (
             <div key={i} className="flex items-start justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rapid Key Cycling detected</p>
                  <p className="text-xs text-muted-foreground">Merchant: <span className="font-mono">mch_8821</span> • 5 rotations in 1 minute</p>
                </div>
                <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50">Review</Button>
             </div>
           ))}
         </div>
      </CardContent>
    </Card>
  );
}

function AdminKeyControls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
           <div className="space-y-0.5">
             <div className="text-sm font-medium">Force Rotation</div>
             <div className="text-xs text-muted-foreground">Require all keys to be rotated next login</div>
           </div>
           <Switch />
         </div>
         <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
           <div className="space-y-0.5">
             <div className="text-sm font-medium text-red-600">Emergency Killswitch</div>
             <div className="text-xs text-muted-foreground">Revoke all active keys immediately</div>
           </div>
           <Button variant="destructive" size="sm">Execute</Button>
         </div>
      </CardContent>
    </Card>
  );
}

// --- 4. Developer Components ---

function DeveloperConnectionStatusCard() {
  return (
    <Card className="bg-slate-900 text-white border-slate-800">
      <CardContent className="p-6">
         <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Connected to Sandbox</h3>
              <p className="text-slate-400 text-sm">Your local environment is synced.</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50">Online</Badge>
         </div>
         
         <div className="space-y-4 font-mono text-sm">
           <div className="flex justify-between border-b border-slate-800 pb-2">
             <span className="text-slate-500">Merchant</span>
             <span>Test Merchant A</span>
           </div>
           <div className="flex justify-between border-b border-slate-800 pb-2">
             <span className="text-slate-500">Last Event</span>
             <span>payment.created (2s ago)</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-500">Latency</span>
             <span className="text-green-400">24ms</span>
           </div>
         </div>
      </CardContent>
    </Card>
  );
}

function DeveloperQuickstartChecklist() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
            Get your API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="text-sm text-muted-foreground">Generate your test keys to start making authenticated requests.</p>
           <div className="bg-muted p-2 rounded text-xs font-mono flex items-center justify-between">
             <span className="truncate mr-2">pk_test_...</span>
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
               {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
             </Button>
           </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
         <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-primary transition-colors" />
         <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center text-xs transition-colors">2</div>
            Make your first request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="text-sm text-muted-foreground">Use the SDK to initialize a payment session.</p>
           <Button variant="outline" size="sm" className="w-full">View Guide</Button>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
         <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 group-hover:bg-primary transition-colors" />
         <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center text-xs transition-colors">3</div>
            Listen for Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="text-sm text-muted-foreground">Set up a local listener to handle async events.</p>
           <Button variant="outline" size="sm" className="w-full">Open CLI</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DeveloperEndpointExplorer() {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col md:flex-row h-[500px] bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r bg-gray-50 p-4 space-y-6">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Payments</h4>
          <div className="space-y-1">
             <div className="px-2 py-1.5 bg-white border rounded text-xs font-medium text-primary shadow-sm flex items-center justify-between">
               <span>Create Payment</span>
               <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-blue-100 text-blue-700">POST</Badge>
             </div>
             <div className="px-2 py-1.5 hover:bg-gray-100 rounded text-xs font-medium text-muted-foreground flex items-center justify-between cursor-pointer">
               <span>Get Payment</span>
               <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-green-100 text-green-700">GET</Badge>
             </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
           <Badge className="bg-blue-600 hover:bg-blue-700 font-mono">POST</Badge>
           <span className="font-mono text-sm text-muted-foreground">/v1/payments</span>
        </div>
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
           <div className="space-y-4 overflow-y-auto">
              <h4 className="text-sm font-semibold">Body Params</h4>
              <div className="space-y-3">
                 <div className="space-y-1">
                   <label className="text-xs font-mono text-muted-foreground">amount</label>
                   <Input defaultValue="1000" className="font-mono text-sm" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-mono text-muted-foreground">currency</label>
                   <Select defaultValue="usd">
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent><SelectItem value="usd">USD</SelectItem></SelectContent>
                   </Select>
                 </div>
              </div>
              <Button className="w-full"><Play className="w-4 h-4 mr-2" /> Send Request</Button>
           </div>
           <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-y-auto">
              <pre>{`{
  "id": "pay_1928374",
  "object": "payment",
  "amount": 1000,
  "currency": "usd",
  "status": "pending",
  "created": 1697234211
}`}</pre>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- 5. Example Screens ---

function ExampleDocsHome() {
  return (
    <div className="min-h-screen bg-background">
      <DeveloperDocsTopNav />
      <DeveloperDocsStatusBar />
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
         <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="flex-1 space-y-6">
             <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary mb-2">v2.0 Now Available</Badge>
             <h1 className="text-4xl font-bold tracking-tight">Build your payment flow</h1>
             <p className="text-lg text-muted-foreground leading-relaxed">
               The QrStore API allows you to accept payments, manage refunds, and sync inventory with just a few lines of code.
             </p>
             <div className="flex gap-4">
               <Button size="lg">Read the Docs</Button>
               <Button variant="outline" size="lg">Get API Keys</Button>
             </div>
           </div>
           <div className="w-full md:w-80 flex-shrink-0">
             <DeveloperConnectionStatusCard />
           </div>
         </div>

         <div>
           <h2 className="text-2xl font-bold mb-6">Quickstart</h2>
           <DeveloperQuickstartChecklist />
         </div>

         <div>
           <h2 className="text-2xl font-bold mb-6">Explore the API</h2>
           <DeveloperEndpointExplorer />
         </div>

         <div>
           <h2 className="text-2xl font-bold mb-6">Test Webhooks</h2>
           <DeveloperWebhookTester />
         </div>
      </main>
    </div>
  );
}

function ExampleMerchantIntegrations() {
  return (
    <div className="min-h-screen bg-gray-50/50">
       <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
         <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Credentials & Integrations</h1>
              <p className="text-muted-foreground">Manage your API keys and webhook listeners.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Docs</Button>
               <Button><Plus className="w-4 h-4 mr-2" /> Create Key</Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-lg font-semibold">API Keys</h2>
                  <MerchantAppKeysTable />
               </div>
               
               <MerchantWebhookManager />
            </div>

            <div className="space-y-6">
               <MerchantCredentialsCreatePanel />
               <MerchantKeyActivityFeed />
            </div>
         </div>
       </div>
    </div>
  );
}

function ExampleAdminKeys() {
  return (
    <div className="min-h-screen bg-gray-100">
       <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-2">
           <Shield className="w-5 h-5 text-indigo-600" />
           <span className="font-semibold text-lg">Admin / Key Management</span>
         </div>
         <Button size="sm" variant="outline">Export Audit Log</Button>
       </div>
       
       <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <AdminMerchantKeyOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             <div className="lg:col-span-3 space-y-6">
               <AdminMerchantKeyActivityPanel />
             </div>
             
             <div className="space-y-6">
               <AdminSuspiciousActivityQueue />
               <AdminIntegrationPolicyChecklist />
               <AdminKeyControls />
             </div>
          </div>
       </main>
    </div>
  );
}

// --- Main Page Component ---

export default function DeveloperPlatformPage() {
  const [activeTab, setActiveTab] = useState("docs");

  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen">
      {/* Meta-Navigation for Presentation */}
      <div className="bg-slate-900 text-white p-2 text-xs flex justify-center items-center gap-4 sticky top-0 z-50 shadow-md">
         <span className="font-mono opacity-50">PREVIEW MODE:</span>
         <button 
           onClick={() => setActiveTab("docs")}
           className={cn("px-3 py-1 rounded transition-colors", activeTab === "docs" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400")}
         >
           1. Developers (Docs)
         </button>
         <button 
           onClick={() => setActiveTab("merchant")}
           className={cn("px-3 py-1 rounded transition-colors", activeTab === "merchant" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400")}
         >
           2. Merchant (Integrations)
         </button>
         <button 
           onClick={() => setActiveTab("admin")}
           className={cn("px-3 py-1 rounded transition-colors", activeTab === "admin" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400")}
         >
           3. Admin (Keys)
         </button>
      </div>

      {activeTab === "docs" && <ExampleDocsHome />}
      {activeTab === "merchant" && <ExampleMerchantIntegrations />}
      {activeTab === "admin" && <ExampleAdminKeys />}
    </div>
  );
}
