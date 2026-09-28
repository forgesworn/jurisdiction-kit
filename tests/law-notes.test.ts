import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const law = join(root, 'law');
const skill = join(root, 'skill');
const script = join(skill, 'scripts', 'law-notes.sh');
const inventory = join(skill, 'scripts', 'project-inventory.sh');

/** Every note, as its name under law/ without the extension. */
function notes(): string[] {
  return readdirSync(law)
    .filter((entry) => statSync(join(law, entry)).isDirectory())
    .flatMap((code) =>
      readdirSync(join(law, code))
        .filter((file) => file.endsWith('.md'))
        .map((file) => `${code}/${file.slice(0, -3)}`),
    );
}

function run(args: string[], today?: string): { out: string; code: number } {
  try {
    const out = execFileSync('sh', [script, ...args], {
      encoding: 'utf8',
      env: { ...process.env, ...(today ? { LAW_NOTES_TODAY: today } : {}) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { out, code: 0 };
  } catch (error) {
    const failed = error as { stdout?: string; status?: number };
    return { out: failed.stdout ?? '', code: failed.status ?? 1 };
  }
}

describe('law notes', () => {
  it('has at least one note', () => {
    expect(notes().length).toBeGreaterThan(0);
  });

  it('lives under a lower-case ISO code', () => {
    for (const note of notes()) expect(note).toMatch(/^[a-z]{2}\/[a-z0-9-]+$/);
  });

  it('gives every note both dates, in a form the script reads', () => {
    const { out, code } = run(['status'], '2000-01-01');
    expect(code).toBe(0);
    const lines = out.trim().split('\n');
    expect(lines).toHaveLength(notes().length);
    for (const line of lines) {
      expect(line).toMatch(/^[a-z]{2}\/[a-z0-9-]+\tverified \d{4}-\d{2}-\d{2}\treview by \d{4}-\d{2}-\d{2}\tok$/);
    }
  });

  it('puts the review date after the verified date', () => {
    for (const line of run(['status'], '2000-01-01').out.trim().split('\n')) {
      const [, verified, review] = /verified (\S+)\treview by (\S+)/.exec(line)!;
      expect(review > verified).toBe(true);
    }
  });

  it('lists every note in the index, with the dates the note itself carries', () => {
    const index = readFileSync(join(law, 'README.md'), 'utf8');
    for (const note of notes()) {
      expect(index).toContain(`(${note}.md)`);
      const text = readFileSync(join(law, `${note}.md`), 'utf8');
      const verified = /^\| Verified \| ([^|]+?) \|$/m.exec(text)![1];
      const review = /^\| Review by \| (\d+ \w+ \d{4})/m.exec(text)![1];
      const row = index.split('\n').find((line) => line.includes(`(${note}.md)`))!;
      expect(row).toContain(verified);
      expect(row).toContain(review);
    }
  });

  it('marks every note as research and not advice', () => {
    for (const note of notes()) {
      expect(readFileSync(join(law, `${note}.md`), 'utf8')).toContain('Not legal advice');
    }
  });

  it('gives every note a watch list, a change log and sources', () => {
    for (const note of notes()) {
      const text = readFileSync(join(law, `${note}.md`), 'utf8');
      expect(text).toMatch(/^## \d+\. Watch list$/m);
      expect(text).toMatch(/^## \d+\. Change log$/m);
      expect(text).toMatch(/^## \d+\. Sources$/m);
    }
  });
});

describe('law-notes.sh', () => {
  it('finds the notes beside the skill', () => {
    expect(run(['path']).out.trim()).toBe(law);
  });

  it('says a note is overdue the day after its review date, and not on the day', () => {
    expect(run(['status'], '2027-03-28')).toMatchObject({ code: 0 });
    const late = run(['status'], '2027-03-29');
    expect(late.code).toBe(3);
    expect(late.out).toContain('OVERDUE');
  });

  it('prints one subsection and stops at the next', () => {
    const { out, code } = run(['section', 'gb/online-services', '2.6']);
    expect(code).toBe(0);
    expect(out.startsWith('### 2.6 ')).toBe(true);
    expect(out).not.toContain('### 2.7');
  });

  it('tells section 2.10 from section 2.1', () => {
    const tenth = run(['section', 'gb/online-services', '2.10']).out;
    expect(tenth.startsWith('### 2.10 ')).toBe(true);
    const first = run(['section', 'gb/online-services', '2.1']).out;
    expect(first.startsWith('### 2.1 ')).toBe(true);
    expect(first).not.toContain('### 2.2');
  });

  it('prints a whole section with its subsections, and stops at the next section', () => {
    const { out } = run(['section', 'gb/online-services', '2']);
    expect(out.startsWith('## 2. ')).toBe(true);
    expect(out).toContain('### 2.9');
    expect(out).not.toContain('## 3. ');
  });

  it('prints the watch list', () => {
    expect(run(['watch', 'gb/online-services']).out).toMatch(/^## \d+\. Watch list/);
  });

  it('fails plainly on a section or note that does not exist', () => {
    expect(run(['section', 'gb/online-services', '99']).code).toBe(1);
    expect(run(['section', 'zz/nothing', '1']).code).toBe(1);
  });
});

describe('the skill', () => {
  const entry = readFileSync(join(skill, 'SKILL.md'), 'utf8');

  it('has the name and description both hosts need, and nothing else up front', () => {
    const front = /^---\n([\s\S]*?)\n---\n/.exec(entry)![1];
    const keys = front.split('\n').map((line) => line.split(':')[0]);
    expect(keys).toEqual(['name', 'description']);
    expect(front).toContain('name: legal-cover');
  });

  it('links only to references that exist', () => {
    const files = [entry, ...readdirSync(join(skill, 'references')).map((file) => readFileSync(join(skill, 'references', file), 'utf8'))];
    const linked = files.flatMap((text) => [...text.matchAll(/\]\((references\/)?([a-z-]+\.md)\)/g)].map((match) => match[2]));
    expect(linked.length).toBeGreaterThan(0);
    for (const file of linked) expect(existsSync(join(skill, 'references', file))).toBe(true);
  });

  it('names no section of a note that the note does not have', () => {
    const documents = readFileSync(join(skill, 'references', 'documents.md'), 'utf8');
    const table = documents.split('\n').filter((line) => /^\| .* \| .* \| [\d., ]+ \|$/.test(line));
    expect(table.length).toBeGreaterThan(0);
    for (const row of table) {
      for (const section of row.split('|')[3].split(',').map((part) => part.trim())) {
        expect(run(['section', 'gb/online-services', section]).code, `section ${section}`).toBe(0);
      }
    }
  });
});

describe('project-inventory.sh', () => {
  /** A project small enough to read here, with one of everything the script looks for. */
  function project(files: Record<string, string>): string {
    const dir = mkdtempSync(join(tmpdir(), 'inventory-'));
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      writeFileSync(join(dir, path), text);
    }
    return dir;
  }

  function section(report: string, number: number): string {
    const from = report.indexOf(`\n## ${number}. `);
    const to = report.indexOf(`\n## ${number + 1}. `);
    return report.slice(from, to === -1 ? undefined : to);
  }

  const dir = project({
    'src/about.ts': [
      '// Falls back to wss://relay.two.org when the first is down.',
      "const TIPS = 'lightning:tips@pay.four.io'",
    ].join('\n'),
    'src/app.ts': [
      "const RELAYS = ['wss://relay.one.net', 'wss://relay.two.org']",
      "const ICE = ['stun:stun.three.com:3478']",
      'await fetch(`https://${domain}/.well-known/names.json`)',
      "localStorage.setItem('k', 'v')",
      'const reply = await client.messages.create({ model })',
      "const credential = await fetch('/turn')",
    ].join('\n'),
    'src/app.test.ts': "const RELAY = 'wss://only-in-a-test.net'",
    'test/fixture.ts': "const RELAY = 'wss://only-in-a-fixture.net'",
    'scripts/smoke.mjs': "const RELAY = 'wss://only-in-tooling.net'",
    'node_modules/thing/index.js': "const RELAY = 'wss://only-in-a-dependency.net'",
    'docs/legal/privacy-notice.md': [
      'The service is run by **Somebody**. We use wss://only-in-a-legal-document.net.',
      'Rooms use relay.one.net. We cannot read your messages.',
      '',
      'We do not hold, and cannot',
      'read, your files.',
      '',
      `${'Caf\u00e9s \u2014 '.repeat(30)}we never see what you send \u2014 ${'na\u00efve '.repeat(40)}`,
      '[DECISION: minimum age] [DECISION: the fee] [INPUT: usage figures]',
    ].join('\n'),
    'deploy/host.service': '# Unlike the relay, this process DOES hold the room key.',
    'deploy/blind.service': '# It is given the room id and never the room key. It holds nothing.',
    'deploy/paid/README.md': 'A paid endpoint.',
    'deploy/Caddyfile.site': [
      'site.example {',
      '\t# Unauthenticated by design.',
      '\thandle /turn {',
      '\t\treverse_proxy 127.0.0.1:8089',
      '\t}',
      '}',
    ].join('\n'),
    'deploy/l402/aperture.yaml': 'listenaddr: "localhost:8081"',
    'package.json': JSON.stringify({ dependencies: { '@anthropic-ai/sdk': '^1.0.0', leftpad: '1.0.0' } }, null, 2),
  });
  const report = execFileSync('sh', [inventory, dir], { encoding: 'utf8' });
  rmSync(dir, { recursive: true, force: true });

  it('names every host the code contacts, with where it first appears', () => {
    const hosts = section(report, 1);
    expect(hosts).toMatch(/^relay\.one\.net\t1\tsrc\/app\.ts:1$/m);
    expect(hosts).toMatch(/^stun\.three\.com\t1\tsrc\/app\.ts:2$/m);
    expect(hosts).not.toContain('pay.four.io');
  });

  it('gives the first place that is code, not an earlier comment', () => {
    expect(section(report, 1)).toMatch(/^relay\.two\.org\t2\tsrc\/app\.ts:1$/m);
  });

  it('finds a payment address, whose host is a third party too', () => {
    expect(section(report, 5)).toContain('src/about.ts:2:');
  });

  it('leaves out tests, fixtures, tooling and dependencies', () => {
    expect(report).not.toContain('only-in-a-test');
    expect(report).not.toContain('only-in-a-fixture');
    expect(report).not.toContain('only-in-tooling');
    expect(report).not.toContain('only-in-a-dependency');
  });

  it('never takes a legal document as evidence of what the code does', () => {
    expect(section(report, 1)).not.toContain('only-in-a-legal-document');
  });

  it('finds an address built from data', () => {
    expect(section(report, 2)).toContain('src/app.ts:3:');
  });

  it('lists what could be deployed', () => {
    expect(section(report, 3)).toContain('deploy/host.service');
  });

  it('finds the paths the web host passes to a service behind it', () => {
    expect(section(report, 3)).toContain('deploy/Caddyfile.site:3:');
    expect(section(report, 3)).toContain('deploy/Caddyfile.site:4:');
  });

  it('finds a call to a path on the app\'s own origin, which names no host', () => {
    expect(section(report, 3)).toContain('src/app.ts:6:');
    expect(section(report, 1)).not.toContain('src/app.ts:6');
  });

  it('finds the line that says who may use a server', () => {
    expect(section(report, 3)).toContain('deploy/Caddyfile.site:2:');
  });

  it('finds a dependency that sends content to a model, and not an ordinary one', () => {
    expect(section(report, 4)).toContain('@anthropic-ai/sdk');
    expect(section(report, 4)).not.toContain('leftpad');
  });

  it('finds a payment kit by its name', () => {
    expect(section(report, 5)).toContain('deploy/l402/aperture.yaml');
  });

  it('finds a server that holds a content key, and says what follows', () => {
    const keys = section(report, 6);
    const holds = keys.slice(0, keys.indexOf('Says it does not'));
    expect(holds).toContain('deploy/host.service:1:');
    expect(holds).toContain('can read what it');
  });

  it('does not count a server that is never given the key as holding one', () => {
    const keys = section(report, 6);
    const holds = keys.slice(0, keys.indexOf('Says it does not'));
    expect(holds).not.toContain('deploy/blind.service');
    expect(keys.slice(keys.indexOf('Says it does not'))).toContain('deploy/blind.service:1:');
  });

  it('finds code that hands content to a model', () => {
    expect(section(report, 7)).toContain('src/app.ts:5:');
  });

  it('counts what is kept on the device', () => {
    expect(section(report, 8)).toMatch(/^localStorage\t1 uses\tsrc\/app\.ts:4$/m);
  });

  it('says so when it finds nothing', () => {
    expect(section(report, 9)).toContain('(none found)');
  });

  it('lists the legal documents, their open markers, and who they say runs the service', () => {
    const legal = section(report, 13);
    expect(legal).toContain('docs/legal/privacy-notice.md');
    expect(legal).toMatch(/\[DECISION\]\t2/);
    expect(legal).toMatch(/\[INPUT\]\t1/);
    expect(legal).toContain('run by **Somebody**');
  });

  it('names the hosts the legal documents leave out, and not the one they name', () => {
    const check = section(report, 14);
    const unnamed = check.slice(0, check.indexOf('Providers from section 4'));
    expect(unnamed).toContain('relay.two.org');
    expect(unnamed).toContain('stun.three.com');
    expect(unnamed).not.toContain('relay.one.net');
  });

  it('names a provider the legal documents leave out', () => {
    const check = section(report, 14);
    expect(check.slice(check.indexOf('Providers from section 4'), check.indexOf('Claims that content'))).toContain('anthropic');
  });

  it('quotes the claims that content cannot be read, to be tested', () => {
    expect(section(report, 14)).toContain('We cannot read your messages');
  });

  it('finds a claim that breaks across two lines', () => {
    expect(section(report, 14)).toContain('We do not hold, and cannot read, your files.');
  });

  it('never cuts a character in half when it shortens a line', () => {
    expect(section(report, 14)).toContain('we never see what you send');
    expect(report).not.toContain('\uFFFD');
  });

  it('says so when the documents are silent on what is kept on the device', () => {
    const check = section(report, 14);
    expect(check.slice(check.indexOf('What is kept on the device'))).toContain('(nothing)');
  });

  it('skips the cross-check when there are no legal documents', () => {
    const bare = project({ 'src/app.ts': "const RELAY = 'wss://relay.one.net'" });
    const out = execFileSync('sh', [inventory, bare], { encoding: 'utf8' });
    rmSync(bare, { recursive: true, force: true });
    expect(section(out, 14)).toContain('(no legal documents to check)');
  });

  it('refuses a directory that does not exist', () => {
    expect(() => execFileSync('sh', [inventory, join(tmpdir(), 'no-such-project')], { stdio: 'pipe' })).toThrow();
  });
});
