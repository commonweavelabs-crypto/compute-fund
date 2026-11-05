#!/usr/bin/env python3
"""D3 create-path integration test (Sprint-002 stranger-loop pattern, extended)."""
import base64, json, time, urllib.request

BASE = 'http://localhost:8872'
ts = str(int(time.time()))[-6:]
EMAIL = f'cf-d3-{ts}@compute.fund'
ok = []
def check(name, cond, detail=''):
    ok.append(cond)
    print(('PASS ' if cond else 'FAIL ') + name + (' | ' + str(detail)[:80] if not cond else ''))

class Jar:
    def __init__(self): self.c = ''
    def req(self, path, method='GET', data=None, headers=None, raw=False):
        h = {'Content-Type': 'application/x-www-form-urlencoded'}
        if headers: h.update(headers)
        if self.c: h['Cookie'] = self.c
        r = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
        try:
            resp = urllib.request.urlopen(r, timeout=60)
        except urllib.error.HTTPError as e:
            resp = e
        setc = resp.headers.get_all('Set-Cookie') or []
        for sc in setc:
            kv = sc.split(';')[0]
            if kv.startswith('cf_session'): self.c = kv
        body = resp.read()
        if raw: return resp.status, body
        return resp.status, (json.loads(body) if body and body[:1] in (b'{', b'[') else body.decode('utf-8','replace')[:200])

jar = Jar()
s, d = jar.req('/api/auth/signup', 'POST', json.dumps({'email': EMAIL, 'password': 'd3-int-test-pass', 'displayName': 'D3 Tester'}).encode(), {'Content-Type': 'application/json'})
check('signup', s == 200, d)

cfq = {'question': f'Given a near-cap key {ts}, does applying the qwen3:4b model produce a governed 402 once spend exceeds the cap?', 'data_inputs': 'N-001 corpus (public, sha256 in receipt)', 'method': '["qwen3:4b"]', 'deliverable': 'the D3 test receipt page', 'done_criteria': 'this scripted test reaches 200 on publish within 30s', 'falsified_by': 'any 422/404 in this sequence', 'review_process': 'the script itself asserts; the receipts page is public', 'budget_credits': 1000, 'deadline': '2026-12-01', 'assumptions': 'dev server up; DB writable'}
P = {'name': f'D3 Test Flow {ts}', 'one_liner': 'the create-path integration test project', 'status': 'draft', 'repo_url': f'https://github.com/commonweavelabs-crypto/compute-fund', 'links': [{'label': 'Code', 'url': 'https://github.com/commonweavelabs-crypto/compute-fund'}]}
s, d = jar.req('/api/project', 'POST', json.dumps({**cfq, **P}).encode(), {'Content-Type': 'application/json'})
check('draft create', s == 200 and d.get('status') == 'draft', d)
slug = d.get('slug', '')

s2, d2 = Jar().req(f'/api/pubproj/{slug}')
check('draft is PRIVATE to strangers', s2 == 404, (s2, d2))
s2, d2 = jar.req(f'/api/pubproj/{slug}')
check('draft visible to OWNER', s2 == 200 and d2.get('status') == 'draft', (s2, str(d2)[:60]))

s3, d3 = jar.req('/api/project', 'PATCH', json.dumps({'slug': slug, 'action': 'publish'}).encode(), {'Content-Type': 'application/json'})
check('publish draft', s3 == 200 and d3.get('status') == 'active', d3)
s4, d4 = jar.req(f'/api/pubproj/{slug}')
check('published is public + fields', s4 == 200 and d4.get('repo_url', '').startswith('https://') and d4.get('links'), d4)

s5, d5 = jar.req('/api/org', 'POST', json.dumps({'name': f'D3 Test Org {ts}', 'bio': 'an org from the test'}).encode(), {'Content-Type': 'application/json'})
check('org create', s5 == 200 and d5.get('slug'), d5)
orgslug = d5.get('slug', '')
s6, d6 = jar.req('/api/project', 'PATCH', json.dumps({'slug': slug, 'action': 'transfer', 'org_slug': orgslug}).encode(), {'Content-Type': 'application/json'})
check('transfer project -> org', s6 == 200, d6)
s7, d7 = jar.req(f'/api/puborg/{orgslug}')
check('org page data has the project', s7 == 200 and any(p['slug'] == slug for p in d7.get('projects', [])), str(d7)[:120])

s8, d8 = jar.req('/api/account', 'PATCH', json.dumps({'fields': {'bio': 'integration tester', 'display_name': 'D3 Tester'}}).encode(), {'Content-Type': 'application/json'})
check('profile save', s8 == 200 and d8.get('user', {}).get('bio') == 'integration tester', d8)

png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
boundary = 'XbOuNdArYX'
body = (f'--{boundary}\r\nContent-Disposition: form-data; name="kind"\r\n\r\navatar\r\n'
        f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.png"\r\nContent-Type: image/png\r\n\r\n').encode() + png + f'\r\n--{boundary}--\r\n'.encode()
s9, d9 = jar.req('/api/upload', 'POST', body, {'Content-Type': f'multipart/form-data; boundary={boundary}'}, raw=True)
check('avatar upload', s9 == 200 and b'/u/' in d9, d9[:100])

s10, d10 = jar.req(f'/api/upload', 'POST', body.replace(b'name="av', b'name="av'), {'Content-Type': f'multipart/form-data; boundary={boundary}'})
print('\n' + ('ALL PASS: %d checks' % ok.count(True) if all(ok) else 'SOME FAILED: %d/%d' % (ok.count(True), len(ok))))
