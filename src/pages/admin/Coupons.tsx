import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeSwitch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiDollarSign } from 'react-icons/fi';

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  applicablePlanIds: string[];
  activeFrom?: Timestamp;
  activeUntil?: Timestamp;
  isActive: boolean;
}

interface Plan {
  id: string;
  name: string;
}

interface CouponForm {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  maxUses: number | undefined;
  usedCount: number;
  applicablePlanIds: string[];
  isActive: boolean;
}

const defaultForm: CouponForm = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  maxUses: undefined,
  usedCount: 0,
  applicablePlanIds: [],
  isActive: true,
};

const CouponsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponForm>(defaultForm);
  const [activeFrom, setActiveFrom] = useState('');
  const [activeUntil, setActiveUntil] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([fetchCoupons(), fetchPlans()]).finally(() => setLoading(false));
  }, [isAdmin]);

  const fetchCoupons = async () => {
    const snap = await getDocs(collection(firestore, 'coupons'));
    setCoupons(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon)));
  };

  const fetchPlans = async () => {
    const snap = await getDocs(collection(firestore, 'subscriptionPlans'));
    setPlans(snap.docs.map((d) => ({ id: d.id, name: d.data().name } as Plan)));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setActiveFrom('');
    setActiveUntil('');
    setDialogOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: c.discountValue,
      maxUses: c.maxUses,
      usedCount: c.usedCount,
      applicablePlanIds: [...c.applicablePlanIds],
      isActive: c.isActive,
    });
    setActiveFrom(c.activeFrom ? c.activeFrom.toDate().toISOString().slice(0, 16) : '');
    setActiveUntil(c.activeUntil ? c.activeUntil.toDate().toISOString().slice(0, 16) : '');
    setDialogOpen(true);
  };

  const togglePlanId = (planId: string) => {
    setForm((f) => ({
      ...f,
      applicablePlanIds: f.applicablePlanIds.includes(planId)
        ? f.applicablePlanIds.filter((id) => id !== planId)
        : [...f.applicablePlanIds, planId],
    }));
  };

  const save = async () => {
    if (!form.code || form.discountValue <= 0) {
      toast.error('Code and valid discount value are required.');
      return;
    }
    try {
      const data: Record<string, unknown> & { updatedAt: ReturnType<typeof serverTimestamp> } = {
        code: form.code.toUpperCase().trim(),
        description: form.description || '',
        discountType: form.discountType,
        discountValue: form.discountValue,
        maxUses: form.maxUses || null,
        usedCount: editing ? form.usedCount : 0,
        applicablePlanIds: form.applicablePlanIds,
        isActive: form.isActive,
        activeFrom: activeFrom ? Timestamp.fromDate(new Date(activeFrom)) : null,
        activeUntil: activeUntil ? Timestamp.fromDate(new Date(activeUntil)) : null,
        updatedAt: serverTimestamp(),
      };
      if (editing) {
        await updateDoc(doc(firestore, 'coupons', editing.id), data);
        toast.success('Coupon updated.');
      } else {
        await addDoc(collection(firestore, 'coupons'), { ...data, createdAt: serverTimestamp() });
        toast.success('Coupon created.');
      }
      setDialogOpen(false);
      fetchCoupons();
    } catch (e: unknown) {
      toast.error('Failed to save: ' + getErrorMessage(e));
    }
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(firestore, 'coupons', id));
    toast.success('Coupon deleted.');
    fetchCoupons();
    setDeleteTarget(null);
  };

  const formatDiscount = (c: Coupon) => {
    if (c.discountType === 'percentage') return `${c.discountValue}%`;
    return `$${(c.discountValue / 100).toFixed(2)}`;
  };

  if (loading) return <div className="max-w-5xl mx-auto pb-8"><DashboardCard><p className="text-muted-foreground p-4">Loading...</p></DashboardCard></div>;

  return (
    <div className="max-w-5xl mx-auto pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-1">Coupons</h1>
          <p className="text-muted-foreground text-sm">{coupons.length} coupon(s)</p>
        </div>
        <Button onClick={openCreate} className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 self-start">
          <FiPlus className="w-4 h-4" />New Coupon
        </Button>
      </div>

      <DashboardCard>
        <div className="p-4 space-y-3">
          {coupons.length === 0 && <p className="text-muted-foreground">No coupons yet.</p>}
          {coupons.map((c) => (
            <Card key={c.id} className={!c.isActive ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{c.code}</h3>
                      <Badge variant={c.discountType === 'percentage' ? 'default' : 'secondary'}>
                        {c.discountType === 'percentage' ? <FiPercent className="mr-1" /> : <FiDollarSign className="mr-1" />}
                        {formatDiscount(c)}
                      </Badge>
                      <Badge variant="outline">Used: {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}</Badge>
                    </div>
                    {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.applicablePlanIds.length === 0 ? (
                        <Badge variant="outline">All plans</Badge>
                      ) : (
                        c.applicablePlanIds.map((pid) => {
                          const plan = plans.find((p) => p.id === pid);
                          return <Badge key={pid} variant="secondary">{plan?.name || pid}</Badge>;
                        })
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeSwitch checked={c.isActive} onCheckedChange={() => {
                      updateDoc(doc(firestore, 'coupons', c.id), { isActive: !c.isActive, updatedAt: serverTimestamp() });
                      fetchCoupons();
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><FiEdit2 /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(c.id)}><FiTrash2 /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Coupon' : 'New Coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="CODE" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
              <div className="flex gap-2">
                <Button
                  variant={form.discountType === 'percentage' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, discountType: 'percentage' as const }))}
                >
                  <FiPercent className="mr-1" /> %
                </Button>
                <Button
                  variant={form.discountType === 'fixed_amount' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, discountType: 'fixed_amount' as const }))}
                >
                  <FiDollarSign className="mr-1" /> $
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  {form.discountType === 'percentage' ? 'Percentage off' : 'Amount off (cents)'}
                </label>
                <Input type="number" min={0} value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: parseInt(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Max Uses (blank = unlimited)</label>
                <Input type="number" min={1} value={form.maxUses || ''} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value ? parseInt(e.target.value) : undefined }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Active From</label>
                <Input type="datetime-local" value={activeFrom} onChange={(e) => setActiveFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Active Until</label>
                <Input type="datetime-local" value={activeUntil} onChange={(e) => setActiveUntil(e.target.value)} />
              </div>
            </div>
            <Textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <div>
              <label className="text-sm font-medium">Applicable plans (empty = all plans):</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {plans.map((p) => (
                  <Badge
                    key={p.id}
                    variant={form.applicablePlanIds.includes(p.id) ? 'default' : 'outline'}
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

      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this coupon? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove(deleteTarget)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CouponsPage;
