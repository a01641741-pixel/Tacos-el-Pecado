import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Mail, Shield, KeyRound, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Accesos() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('mesero');
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadInvitations = async () => {
    try {
      const data = await base44.entities.Invitation.list('-created_date', 50);
      setInvitations(data || []);
    } catch (e) {
      setInvitations([]);
    }
  };

  useEffect(() => { loadInvitations(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedLink(null);
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await base44.entities.Invitation.create({
        email, role, token,
        status: 'pendiente',
        invited_by: user?.full_name || user?.email,
        expires_at: expiresAt,
      });
      const link = `${window.location.origin}/register?token=${token}&email=${encodeURIComponent(email)}`;
      setGeneratedLink(link);
      setEmail('');
      loadInvitations();
      toast({ title: 'Invitación creada', description: 'Comparte el link con la persona.' });
    } catch (e) {
      toast({ title: 'Error', description: e.message || 'No se pudo crear la invitación', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    if (status === 'pendiente') return <Badge className="bg-gold/15 text-gold border-gold/30 hover:bg-gold/20">Pendiente</Badge>;
    if (status === 'activado') return <Badge className="bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/20">Activado</Badge>;
    if (status === 'expirado') return <Badge className="bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/20">Expirado</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="relative z-10 min-h-screen px-4 pt-28 pb-8 sm:px-6 md:px-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-ember/15 flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-ember" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading text-bone">Accesos</h1>
          <p className="text-sm text-bone/50">Genera invitaciones para tu equipo</p>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-bone flex items-center gap-2">
            <Shield className="w-5 h-5 text-ember" />
            Nueva invitación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email" className="text-bone/70">Correo del invitado</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="persona@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-bone/70">Rol a asignar</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mesero">Mesero</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading || !email} className="w-full bg-ember hover:bg-ember-dark text-bone">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
              Generar invitación
            </Button>
          </form>

          {generatedLink && (
            <div className="mt-6 p-4 rounded-lg bg-ember/10 border border-ember/30">
              <p className="text-sm font-semibold text-bone mb-2">Link de invitación:</p>
              <div className="flex items-center gap-2">
                <Input readOnly value={generatedLink} className="bg-background/50 text-xs text-bone/70" />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="shrink-0 border-ember/30"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-bone/70" />}
                </Button>
              </div>
              <p className="text-xs text-bone/40 mt-2">Manda este link por WhatsApp o correo. La persona se registra con el correo que invitaste y se le asigna el rol automáticamente.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-heading text-bone mb-4">Invitaciones existentes</h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-bone/40 text-center py-8">No hay invitaciones todavía.</p>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <Card key={inv.id} className="bg-card/60 backdrop-blur-sm border-border/40">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-bone truncate">{inv.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-bone/50 uppercase tracking-wide">{inv.role}</span>
                      {inv.invited_by && <span className="text-xs text-bone/30">· por {inv.invited_by}</span>}
                      {inv.expires_at && (
                        <span className="text-xs text-bone/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(inv.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {inv.status === 'pendiente' && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const link = `${window.location.origin}/register?token=${inv.token}&email=${encodeURIComponent(inv.email)}`;
                          navigator.clipboard.writeText(link);
                          toast({ title: 'Link copiado' });
                        }}
                        className="text-bone/50 hover:text-bone shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {statusBadge(inv.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
