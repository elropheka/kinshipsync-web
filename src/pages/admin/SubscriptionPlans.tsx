import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeSwitch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiRefreshCw, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { seedSubscriptionData } from '@/services/seedSubscriptionData';

interface AppFeature {
  id: string;
  key: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice?: number;
  currency: string;
  interval: string;
  trialDays?: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  metadata?: { color?: string; accentColor?: string };
}

const defaultPlan: Omit<Plan, 'id'> = {
  name: '',
  description: '',
  price: 0,
  yearlyPrice: undefined,
  currency: 'USD',
  interval: 'month',
  trialDays: 0,
  features: [],
  isActive: true,
  sortOrder: 0,
  metadata: { color: '#D6C8AF', accentColor: '#F5EFE8' },
};

const SubscriptionPlansPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, 'id'>>(defaultPlan);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'features'>('details');
  const [appFeatures, setAppFeatures] = useState<AppFeature[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPlans();
    fetchAppFeatures();
  }, [isAdmin]);

  const fetchAppFeatures = async () => {
    try {
      const q = query(collection(firestore, 'appFeatures'), where('isActive', '==', true));
      const snap = await getDocs(q);
      setAppFeatures(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppFeature)));
    } catch (e: unknown) {
      console.error('Failed to load app features:', e);
    }
  };

  const fetchPlans = async () => {
    try {
      const q = query(collection(firestore, 'subscriptionPlans'), orderBy('sortOrder'));
      const snap = await getDocs(q);
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Plan)));
    } catch (e: unknown) {
      toast.error('Failed to load plans: ' + getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ ...defaultPlan, sortOrder: plans.length });
    setActiveTab('details');
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      yearlyPrice: plan.yearlyPrice,
      currency: plan.currency,
      interval: plan.interval,
      trialDays: plan.trialDays || 0,
      features: [...plan.features],
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
      metadata: plan.metadata,
    });
    setActiveTab('details');
    setDialogOpen(true);
  };

  const toggleFeature = (featureName: string) => {
    setForm((f) => {
      const exists = f.features.some((n) => n.toLowerCase() === featureName.toLowerCase());
      return {
        ...f,
        features: exists
          ? f.features.filter((n) => n.toLowerCase() !== featureName.toLowerCase())
          : [...f.features, featureName],
      };
    });
  };

  const save = async () => {
    if (!form.name || form.price < 0) {
      toast.error('Name and valid price are required.');
      return;
    }
    try {
      const data = {
        ...form,
        trialDays: form.trialDays || 0,
        updatedAt: serverTimestamp(),
      };
      if (editingPlan) {
        await updateDoc(doc(firestore, 'subscriptionPlans', editingPlan.id), data);
        toast.success('Plan updated.');
      } else {
        await addDoc(collection(firestore, 'subscriptionPlans'), { ...data, createdAt: serverTimestamp() });
        toast.success('Plan created.');
      }
      setDialogOpen(false);
      fetchPlans();
    } catch (e: unknown) {
      toast.error('Failed to save plan: ' + getErrorMessage(e));
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'subscriptionPlans', id));
      toast.success('Plan deleted.');
      fetchPlans();
    } catch (e: unknown) {
      toast.error('Failed to delete plan: ' + getErrorMessage(e));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSeed = async () => {
    setShowSeedConfirm(false);
    setSeeding(true);
    try {
      await seedSubscriptionData();
      toast.success('Default plans and features created.');
      await Promise.all([fetchPlans(), fetchAppFeatures()]);
    } catch (e: unknown) {
      toast.error('Seed failed: ' + getErrorMessage(e));
    } finally {
      setSeeding(false);
    }
  };

  const toggleActive = async (plan: Plan) => {
    await updateDoc(doc(firestore, 'subscriptionPlans', plan.id), {
      isActive: !plan.isActive,
      updatedAt: serverTimestamp(),
    });
    fetchPlans();
  };

  if (loading) return <div className="max-w-5xl mx-auto pb-8"><DashboardCard><p className="text-muted-foreground p-4">Loading...</p></DashboardCard></div>;

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-1">Subscription Plans</h1>
          <p className="text-muted-foreground text-sm">{plans.length} plan(s)</p>
        </div>
        <div className="flex gap-2">
          {plans.length === 0 && (
            <Button onClick={() => setShowSeedConfirm(true)} disabled={seeding} variant="outline" className="gap-2">
              <FiRefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding...' : 'Seed Defaults'}
            </Button>
          )}
          <Button onClick={openCreate} className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 self-start">
            <FiPlus className="w-4 h-4" />New Plan
          </Button>
        </div>
      </div>

      <DashboardCard>
        <div className="p-4 space-y-4">
          {plans.length === 0 && <p className="text-muted-foreground">No plans yet.</p>}
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${!plan.isActive ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plan.metadata?.color || '#D6C8AF' }} />
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>{plan.isActive ? 'Active' : 'Inactive'}</Badge>
                    <ThemeSwitch checked={plan.isActive} onCheckedChange={() => toggleActive(plan)} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                      <FiEdit2 />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(plan.id)}>
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="flex items-center gap-1"><FiDollarSign className="w-3 h-3" />${(plan.price / 100).toFixed(2)}/mo</span>
                  {plan.yearlyPrice ? <span>${(plan.yearlyPrice / 100).toFixed(2)}/yr</span> : null}
                  {plan.trialDays ? <span>{plan.trialDays}-day trial</span> : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {plan.features.map((f, i) => (
                    <Badge key={i} variant={appFeatures.some((af) => af.name === f) ? 'default' : 'outline'}>
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'New Plan'}</DialogTitle>
          </DialogHeader>

          <div className="flex border-b border-border mb-4">
            <button
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'features' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-3">
              <Input placeholder="Plan name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Monthly Price (cents)</label>
                  <Input type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Yearly Price (cents, optional)</label>
                  <Input type="number" min={0} value={form.yearlyPrice || ''} onChange={(e) => setForm((f) => ({ ...f, yearlyPrice: e.target.value ? parseInt(e.target.value) : undefined }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Trial Days</label>
                  <Input type="number" min={0} value={form.trialDays} onChange={(e) => setForm((f) => ({ ...f, trialDays: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sort Order</label>
                  <Input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Color</label>
                  <Input type="color" value={form.metadata?.color || '#D6C8AF'} onChange={(e) => setForm((f) => ({ ...f, metadata: { ...f.metadata, color: e.target.value } }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Accent Color</label>
                  <Input type="color" value={form.metadata?.accentColor || '#F5EFE8'} onChange={(e) => setForm((f) => ({ ...f, metadata: { ...f.metadata, accentColor: e.target.value } }))} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {appFeatures.length === 0 ? (
                <p className="text-sm text-muted-foreground">No features defined. Go to Subscriptions &gt; Features to create some.</p>
              ) : (
                appFeatures.map((af) => {
                  const planFeatureNames = form.features.map((f) => f.toLowerCase());
                  const selected = planFeatureNames.includes(af.name.toLowerCase());
                  return (
                    <div
                      key={af.id}
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => toggleFeature(af.name)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFeature(af.name); }}
                    >
                      {selected ? (
                        <FiCheckSquare className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <FiSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{af.name}</p>
                        {af.description && <p className="text-xs text-muted-foreground">{af.description}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editingPlan ? 'Update Plan' : 'Create Plan'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this plan? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove(deleteTarget)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSeedConfirm} onOpenChange={setShowSeedConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seed Default Data</AlertDialogTitle>
            <AlertDialogDescription>This will reset all plans and features to defaults. Existing data will be deactivated. Continue?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSeedConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSeed}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionPlansPage;
