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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
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
  metadata: { color: '#757575', accentColor: '#f5f5f5' },
};

const SubscriptionPlansPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, 'id'>>(defaultPlan);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appFeatures, setAppFeatures] = useState<AppFeature[]>([]);

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
    } catch (e: any) {
      console.error('Failed to load app features:', e);
    }
  };

  const fetchPlans = async () => {
    try {
      const q = query(collection(firestore, 'subscriptionPlans'), orderBy('sortOrder'));
      const snap = await getDocs(q);
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Plan)));
    } catch (e: any) {
      toast.error('Failed to load plans: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ ...defaultPlan, sortOrder: plans.length });
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
    setDialogOpen(true);
  };

  const toggleFeature = (featureName: string) => {
    setForm((f) => ({
      ...f,
      features: f.features.includes(featureName)
        ? f.features.filter((n) => n !== featureName)
        : [...f.features, featureName],
    }));
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
    } catch (e: any) {
      toast.error('Failed to save plan: ' + e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await deleteDoc(doc(firestore, 'subscriptionPlans', id));
      toast.success('Plan deleted.');
      fetchPlans();
    } catch (e: any) {
      toast.error('Failed to delete plan: ' + e.message);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will reset all plans and features to defaults. Continue?')) return;
    setSeeding(true);
    try {
      await seedSubscriptionData();
      toast.success('Default plans and features created.');
      await Promise.all([fetchPlans(), fetchAppFeatures()]);
    } catch (e: any) {
      toast.error('Seed failed: ' + e.message);
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
            <Button onClick={handleSeed} disabled={seeding} variant="outline" className="gap-2">
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
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plan.metadata?.color || '#757575' }} />
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
                    <Button variant="ghost" size="icon" onClick={() => remove(plan.id)}>
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
                <Input type="color" value={form.metadata?.color || '#757575'} onChange={(e) => setForm((f) => ({ ...f, metadata: { ...f.metadata, color: e.target.value } }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Accent Color</label>
                <Input type="color" value={form.metadata?.accentColor || '#f5f5f5'} onChange={(e) => setForm((f) => ({ ...f, metadata: { ...f.metadata, accentColor: e.target.value } }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Features</label>
              {appFeatures.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">No features defined. Go to Subscriptions &gt; Features to create some.</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {appFeatures.map((af) => {
                  const selected = form.features.includes(af.name);
                  return (
                    <Badge
                      key={af.id}
                      variant={selected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleFeature(af.name)}
                    >
                      {af.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <Button onClick={save} className="w-full">{editingPlan ? 'Update Plan' : 'Create Plan'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansPage;
