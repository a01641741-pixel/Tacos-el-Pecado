import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { token } = body;

    if (!token) return Response.json({ error: 'Token required' }, { status: 400 });

    // Find invitation by token + email + pending
    const invitations = await base44.asServiceRole.entities.Invitation.filter({
      token: token,
      email: user.email,
      status: 'pendiente'
    });

    if (!invitations || invitations.length === 0) {
      return Response.json({ success: false, error: 'invalid_invitation' });
    }

    const invitation = invitations[0];

    // Check expiration
    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      await base44.asServiceRole.entities.Invitation.update(invitation.id, { status: 'expirado' });
      return Response.json({ success: false, error: 'expired_invitation' });
    }

    // Assign role to user
    await base44.asServiceRole.entities.User.update(user.id, { role: invitation.role });

    // Mark invitation as activated
    await base44.asServiceRole.entities.Invitation.update(invitation.id, { status: 'activado' });

    return Response.json({ success: true, role: invitation.role });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
