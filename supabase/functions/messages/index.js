// Edge Function: list contact messages for the authenticated admin.
//
// auth: "user" → withSupabase requires a valid Supabase user JWT (verified via
// SUPABASE_JWKS_URL) and gives you ctx.supabase, an RLS-scoped client acting AS
// that user. The "authenticated can read messages" RLS policy then allows the
// SELECT — so this returns rows only for a logged-in admin, never the public.
//
// On the Deno Edge runtime you may need to prefix the import with `npm:`
// (i.e. `from "npm:@supabase/server"`) or add it to an import map, depending on
// your Supabase CLI version. The bare specifier matches the package's docs.
import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    const { data, error } = await ctx.supabase
      .from("messages")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json(data)
  }),
}
