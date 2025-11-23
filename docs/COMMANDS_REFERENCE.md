# Project Commands Reference

Central place to track important commands used across this project.
Update this file as the project grows.

---

## 1. Expo / React Native

### Start the app (development)
```bash
npx expo start
```

### Clear Metro cache and restart
```bash
npx expo start -c
```

---

## 2. Supabase & Database

### Push local SQL changes to Supabase
```bash
supabase db push
```

### Deploy Edge Functions
```bash
supabase functions deploy create_payment_intent
supabase functions deploy stripe_webhook
supabase functions deploy image_classify
supabase functions deploy image_embed
supabase functions deploy image_search
```

### Serve an Edge Function locally
```bash
supabase functions serve image_classify
```

---

## 3. Supabase Types Generation

### Regenerate TypeScript types from Supabase schema
(Uses the project id from your `.env`)
```bash
npx supabase gen types typescript \
  --project-id "fanfpoarmlkrwugzbrhl" \
  --schema public \
  > src/types/database.types.ts
```

Run this after changing database schema in Supabase so your `Tables<>` and other types stay in sync.

---

## 4. Visual Search / Embeddings (Backfill)

### Backfill product embeddings via script
```bash
MODEL=mock-hash-v1 PROVIDER=mock \
SUPABASE_URL=$EXPO_PUBLIC_SUPABASE_URL \
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY \
  ts-node scripts/backfill-product-embeddings.ts
```

Refer to `docs/image-search-run-instructions.md` for full visual search pipeline commands.

---

## 5. Node / Package Management

### Install dependencies
```bash
npm install
```

### Add Expo image picker + utilities (already installed once)
```bash
npx expo install expo-image-picker expo-file-system expo-image-manipulator
```

---

## 6. Python Virtual Environment (If/When Needed)

### Activate venv
```bash
source /home/mukulah/E-Com-Shop/.venv/bin/activate
```

### Deactivate venv
```bash
deactivate
```

---

## 7. Notes
- Keep this file updated whenever you add new scripts or common CLI flows.
- For environment variables, see `.env`.
- For image search specific instructions, see `docs/image-search.md` and `docs/image-search-run-instructions.md`.
