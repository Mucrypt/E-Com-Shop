# Sensitive Key Rotation & Handling

This project uses Supabase service role and Stripe secrets that MUST remain off the client bundle and out of version control.

## 1. Identify Secrets
- `SUPABASE_SERVICE_ROLE_KEY` (server only – never ship to client or mobile app)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Any future gateway / provider keys

## 2. Remove Accidental Commits
If any real keys were committed:
1. Invalidate / rotate them immediately in the provider dashboard.
2. Force-push removal only AFTER rotation (history may still contain the old key; treat it as compromised).
3. Replace with placeholder values in `.env.example`.

## 3. Store in Supabase / Hosting Env Vars
Use the Supabase Dashboard (Project Settings → Functions → Environment Variables) for Edge Functions:
- Add `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- Re-deploy functions after changes.

## 4. Local Development
Create a local `.env` (excluded by `.gitignore`) containing only development versions of secrets. Example:
```
SUPABASE_URL=<your-project-url>
SUPABASE_SERVICE_ROLE_KEY=<rotated-service-role-key>
STRIPE_SECRET_KEY=<sk_live_or_test>
STRIPE_WEBHOOK_SECRET=<whsec_...>
```
Never commit `.env` – ensure `.gitignore` lists it.

## 5. Client vs Server Split
- Mobile/web client should use **anon/public** Supabase key only.
- Service role key usage confined to backend code (`supabase/functions/*`, server API routes, or secure Node scripts).

## 6. Rotation Procedure (Quarterly or on Incident)
1. Generate new key in provider (Stripe: restricted API key if possible).
2. Update environment variables in hosting & local `.env`.
3. Redeploy edge functions.
4. Invalidate old key (delete / disable).
5. Run smoke tests: checkout flow, webhook event reception.

## 7. Monitoring & Alerting (Future)
- Add audit log checks for anomalous Stripe calls.
- Track order/payment mismatches flagged as `amount_mismatch`.

## 8. Never Log Secrets
Avoid `console.log` for any secret or full headers. Use partial redaction if debugging: e.g. `sk_live_****tail`.

## 9. Incident Response
If exposure suspected:
- Rotate affected secrets immediately.
- Flag impacted orders; verify payment statuses via provider dashboard.
- Document incident & remediation steps.

---
Follow these practices to keep payment and database operations secure.
