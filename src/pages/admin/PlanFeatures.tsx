import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard, dashboardSectionTitleClass } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeSwitch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Feature {
  id: string;
  key: string;
  name: string;
  description?: string;
  planIds: string[];
  isActive: boolean;
}

interface Plan {
  id: string;
  name: string;
}

const PlanFeaturesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [form, setForm] = useState({ key: '', name: '', description: '', planIds: [] as string[], isActive: true });

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([fetchFeatures(), fetchPlans()]).finally(() => setLoading(false));
  }, [isAdmin]);

  const fetchFeatures = async () => {
    const snap = await getDocs(collection(firestore, 'appFeatures'));
    setFeatures(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Feature)));
  };

  const fetchPlans = async () => {
    const snap = await getDocs(collection(firestore, 'subscriptionPlans'));
    setPlans(snap.docs.map((d) => ({ id: d.id, name: d.data().name } as Plan)));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ key: '', name: '', description: '', planIds: [], isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (f: Feature) => {
    setEditing(f);
    setForm({ key: f.key, name: f.name, description: f.description || '', planIds: [...f.planIds], isActive: f.isActive });
    setDialogOpen(true);
  };

  const togglePlanId = (planId: string) => {
    setForm((f) => ({
      ...f,
      planIds: f.planIds.includes(planId) ? f.planIds.filter((id) => id !== planId) : [...f.planIds, planId],
    }));
  };

  const save = async () => {
    if (!form.key || !form.name) {
      toast.error('Key and name are required.');
      return;
    }
    try {
      const data = { ...form, description: form.description || '', updatedAt: serverTimestamp() };
      if (editing) {
        await updateDoc(doc(firestore, 'appFeatures', editing.id), data);
        toast.success('Feature updated.');
      } else {
        await addDoc(collection(firestore, 'appFeatures'), { ...data, createdAt: serverTimestamp() });
        toast.success('Feature created.');
      }
      setDialogOpen(false);
      fetchFeatures();
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this feature?')) return;
    await deleteDoc(doc(firestore, 'appFeatures', id));
    toast.success('Feature deleted.');
    fetchFeatures();
  };

  if (loading) return <div className="max-w-5xl mx-auto pb-8"><DashboardCard><p className="text-muted-foreground p-4">Loading...</p></DashboardCard></div>;

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-1">Plan Features</h1>
          <p className="text-muted-foreground text-sm">{features.length} feature(s) defined</p>
        </div>
        <Button onClick={openCreate} className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 self-start">
          <FiPlus className="w-4 h-4" />New Feature
        </Button>
      </div>

      <DashboardCard>
        <div className="p-4 space-y-3">
          {features.length === 0 && <p className="text-muted-foreground">No features defined.</p>}
          {features.map((f) => (
            <Card key={f.id} className={!f.isActive ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{f.name}</h3>
                    <p className="text-xs text-muted-foreground">Key: <code>{f.key}</code></p>
                    {f.description && <p className="text-sm text-muted-foreground">{f.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {f.planIds.length === 0 ? (
                        <Badge variant="outline">Free (all plans)</Badge>
                      ) : (
                        f.planIds.map((pid) => {
                          const plan = plans.find((p) => p.id === pid);
                          return <Badge key={pid} variant="secondary">{plan?.name || pid}</Badge>;
                        })
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeSwitch checked={f.isActive} onCheckedChange={() => {
                      updateDoc(doc(firestore, 'appFeatures', f.id), { isActive: !f.isActive, updatedAt: serverTimestamp() });
                      fetchFeatures();
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><FiEdit2 /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(f.id)}><FiTrash2 /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Feature' : 'New Feature'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Feature key (e.g. unlimited_events)" value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value.replace(/\s+/g, '_').toLowerCase() }))} />
            <Input placeholder="Display name (e.g. Unlimited Events)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <div>
              <label className="text-sm font-medium">Assign to plans (empty = free for all):</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {plans.map((p) => (
                  <Badge
                    key={p.id}
                    variant={form.planIds.includes(p.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => togglePlanId(p.id)}
                  >
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={save} className="w-full">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanFeaturesPage;
