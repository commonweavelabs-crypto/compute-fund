import json, sys, urllib.request

ref, access, tunnel = sys.argv[1], sys.argv[2], sys.argv[3]
url = f'https://api.supabase.com/v1/projects/{ref}/config/auth'
def req(method, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    rq = urllib.request.Request(url, data=data, method=method,
        headers={'Authorization': f'Bearer {access}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(rq, timeout=60) as r:
        return json.load(r)

cfg = req('GET')
existing = cfg.get('redirect_urls') or []
host = tunnel.split('//')[1]
target = [tunnel, f'https://{host}/api/auth/callback', 'http://localhost:8872', 'http://localhost:8872/api/auth/callback']
merged = sorted(set(existing) | set(target))
if merged != existing:
    req('PATCH', {'redirect_urls': merged})
    print('patched redirect_urls ->')
    for u in merged:
        print(' ', u)
else:
    print('already aligned:', merged)
print('site_url untouched:', cfg.get('site_url'))
print('github enabled:', cfg.get('external_github_enabled'))