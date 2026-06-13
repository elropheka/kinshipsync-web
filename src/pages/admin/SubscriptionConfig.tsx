import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface Config {
  activeProvider: 'stripe' | 'paystack';
  stripePublicKey?: string;
  paystackPublicKey?: string;
}

const SubscriptionConfigPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [config, setConfig] = useState<Config>({ activeProvider: 'stripe' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    fetchConfig();
  }, [isAdmin]);

  const fetchConfig = async () => {
    try {
      const snap = await getDoc(doc(firestore, 'subscriptionConfig', 'global'));
      if (snap.exists()) {
        setConfig(snap.data() as Config);
      }
    } catch (e: unknown) {
      toast.error('Failed to load config: ' + getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(firestore, 'subscriptionConfig', 'global'), {
        ...config,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Configuration saved.');
    } catch (e: unknown) {
      toast.error('Failed to save: ' + getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto pb-8"><DashboardCard><p className="text-muted-foreground p-4">Loading...</p></DashboardCard></div>;

  return (
    <div className="max-w-4xl mx-auto pb-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground mb-1">Subscription Configuration</h1>
        <p className="text-muted-foreground text-sm">Configure payment provider and API keys</p>
      </div>

      <DashboardCard>
        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Active Payment Provider</label>
            <div className="flex gap-3">
              <Card
                className={`flex-1 cursor-pointer border-2 transition-colors ${config.activeProvider === 'stripe' ? 'border-purple-500 bg-purple-50' : 'border-border'}`}
                onClick={() => setConfig((c) => ({ ...c, activeProvider: 'stripe' }))}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">
                    {config.activeProvider === 'stripe' ? <FiCheckCircle className="inline text-purple-600" /> : <FiAlertCircle className="inline text-muted-foreground" />}
                  </div>
                  <h3 className="font-semibold">Stripe</h3>
                  <p className="text-xs text-muted-foreground">Credit cards, Apple Pay, Google Pay</p>
                </CardContent>
              </Card>
              <Card
                className={`flex-1 cursor-pointer border-2 transition-colors ${config.activeProvider === 'paystack' ? 'border-green-500 bg-green-50' : 'border-border'}`}
                onClick={() => setConfig((c) => ({ ...c, activeProvider: 'paystack' }))}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">
                    {config.activeProvider === 'paystack' ? <FiCheckCircle className="inline text-green-600" /> : <FiAlertCircle className="inline text-muted-foreground" />}
                  </div>
                  <h3 className="font-semibold">Paystack</h3>
                  <p className="text-xs text-muted-foreground">Cards, Mobile Money, Bank Transfer</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Stripe Publishable Key</label>
            <Input
              placeholder="pk_live_..."
              value={config.stripePublicKey || ''}
              onChange={(e) => setConfig((c) => ({ ...c, stripePublicKey: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1">Required if using Stripe. Find in Stripe Dashboard &gt; API keys.</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Paystack Public Key</label>
            <Input
              placeholder="pk_live_..."
              value={config.paystackPublicKey || ''}
              onChange={(e) => setConfig((c) => ({ ...c, paystackPublicKey: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1">Required if using Paystack. Find in Paystack Dashboard &gt; Settings &gt; API Keys &amp; Webhooks.</p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>Note:</strong> Secret keys (STRIPE_SECRET_KEY, PAYSTACK_SECRET_KEY) and webhook secrets are configured via server environment variables, not here.
            </p>
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>

          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium text-sm mb-2">Current Status</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                Provider: {config.activeProvider || 'Not configured'}
              </Badge>
              <Badge variant={config.stripePublicKey || config.paystackPublicKey ? 'default' : 'secondary'}>
                {config.activeProvider === 'stripe'
                  ? config.stripePublicKey ? 'Public key set' : 'Public key missing'
                  : config.paystackPublicKey ? 'Public key set' : 'Public key missing'}
              </Badge>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SubscriptionConfigPage;
