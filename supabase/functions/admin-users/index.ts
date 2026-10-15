import { handleAdminUsers } from '../_shared/adminUsersCore.js';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  try {
    const result = await handleAdminUsers({
      method: req.method,
      body: req.method === 'GET' ? {} : await req.text(),
      authHeader: req.headers.get('Authorization') || '',
      env: Deno.env.toObject(),
    });
    return new Response(JSON.stringify(result.body), {
      status: result.status, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Server error' }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
