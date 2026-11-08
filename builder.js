/* WhereMeGo cartridge builder: Lua editor + media + in-browser Lua 5.1 compiler (Yueliang) + .gwc writer.
   Loaded lazily by index.html; uses the app's globals (state, t, I18N, $, esc, ls, render, startCartridge ...). */
(function () {
'use strict';

/* ------------------------------------------------------------------ texts */
Object.assign(I18N.et, {
 'b.title':'Kasseti ehitaja','b.back':'← Tagasi','b.info':'Kasseti andmed','b.name':'Nimi','b.author':'Autor','b.company':'Firma','b.desc':'Kirjeldus','b.startDesc':'Alguskoha kirjeldus',
 'b.version':'Versioon','b.type':'Tüüp','b.lat':'Laiuskraad','b.lon':'Pikkuskraad','b.here':'Kasuta minu asukohta','b.splash':'Avapilt','b.icon':'Ikoon','b.none':'– pole –',
 'b.media':'Pildid ja helid','b.mediaHelp':'Meedia number on selle järjekorra number (1, 2, 3 …). Luas tuleb ZMedia objektid luua samas järjekorras.','b.addMedia':'+ Lisa faile',
 'b.mediaSnip':'Lisa meedia Lua kood','b.up':'Üles','b.down':'Alla','b.remove':'Eemalda','b.noMedia':'Meediat pole lisatud.','b.mediaBad':'Seda failitüüpi ei toetata: {n}',
 'b.code':'Lua kood','b.sample':'Näidiskassett','b.snip':'Lisa lõik …','b.confirmSample':'Asendan praeguse koodi näidisega?','b.compile':'Kompileeri','b.test':'Testi mängijas','b.save':'Salvesta .gwc',
 'b.busy':'Kompileerin …','b.okCompile':'Kompileerimine õnnestus ({n} baiti).','b.line':'Rida {n}','b.saved':'Fail valmis: {f} ({n} KB).','b.runErr':'Kassett ei käivitu: {m}','b.autosave':'Töö salvestub automaatselt selles brauseris.',
 'b.export':'Ekspordi projekt','b.import':'Impordi projekt','b.importBad':'Projektifaili ei saanud lugeda: {m}','b.ref':'Wherigo funktsioonide ülevaade','b.newProj':'Uus projekt','b.confirmNew':'Kustutan praeguse projekti (kood, andmed ja meedia)?',
 'b.compilerFail':'Kompilaatorit ei saanud laadida ({m}). Ehitaja vajab esimesel korral internetti.','b.hint':'Näpunäide: kassett peab lõppema reaga return cartridge',
 'menu.builder':'🛠 Kasseti ehitaja','menu.builderBack':'← Tagasi ehitajasse (mäng salvestatakse)'
});
Object.assign(I18N.en, {
 'b.title':'Cartridge builder','b.back':'← Back','b.info':'Cartridge details','b.name':'Name','b.author':'Author','b.company':'Company','b.desc':'Description','b.startDesc':'Starting location description',
 'b.version':'Version','b.type':'Type','b.lat':'Latitude','b.lon':'Longitude','b.here':'Use my location','b.splash':'Splash screen','b.icon':'Icon','b.none':'– none –',
 'b.media':'Images and sounds','b.mediaHelp':'A media number is its position in this list (1, 2, 3 …). Create the ZMedia objects in Lua in the same order.','b.addMedia':'+ Add files',
 'b.mediaSnip':'Insert media Lua code','b.up':'Up','b.down':'Down','b.remove':'Remove','b.noMedia':'No media added.','b.mediaBad':'This file type is not supported: {n}',
 'b.code':'Lua code','b.sample':'Sample cartridge','b.snip':'Insert snippet …','b.confirmSample':'Replace the current code with the sample?','b.compile':'Compile','b.test':'Test in player','b.save':'Save .gwc',
 'b.busy':'Compiling …','b.okCompile':'Compiled successfully ({n} bytes).','b.line':'Line {n}','b.saved':'File ready: {f} ({n} KB).','b.runErr':'The cartridge will not start: {m}','b.autosave':'Your work is saved automatically in this browser.',
 'b.export':'Export project','b.import':'Import project','b.importBad':'Cannot read the project file: {m}','b.ref':'Wherigo functions overview','b.newProj':'New project','b.confirmNew':'Delete the current project (code, details and media)?',
 'b.compilerFail':'Could not load the compiler ({m}). The builder needs the internet the first time.','b.hint':'Tip: the cartridge must end with the line return cartridge',
 'menu.builder':'🛠 Cartridge builder','menu.builderBack':'← Back to builder (the game is saved)'
});

/* ------------------------------------------------------------------ project state */
const LSK = 'wheremego:builder';
const TYPES = ['Geocache', 'Tour Guide', 'Wherigo Cartridge', 'Puzzle', 'Event', 'Other'];
const MT = { bmp: 1, png: 2, jpg: 3, jpeg: 3, gif: 4, wav: 17, mp3: 18, ogg: 21 };
const MIMEOF = { 1: 'image/bmp', 2: 'image/png', 3: 'image/jpeg', 4: 'image/gif', 17: 'audio/wav', 18: 'audio/mpeg', 21: 'audio/ogg' };
const TYPENAME = { 1: 'bmp', 2: 'png', 3: 'jpg', 4: 'gif', 17: 'wav', 18: 'mp3', 21: 'ogg' };
const DEF_META = { name: '', author: '', company: '', desc: '', startDesc: '', version: '1.0', type: 'Geocache', lat: '59.4370', lon: '24.7536', splash: 0, icon: 0 };

let B = null;                        // { meta, code, media: [{ name, type, buf }] }
let saveTimer = 0, compilerVm = null, busy = false;

const idbOpen = () => new Promise((res, rej) => {
  const r = indexedDB.open('wheremego-builder', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('kv');
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
});
async function idbRun(mode, fn) {
  const db = await idbOpen();
  return new Promise((res, rej) => {
    const tx = db.transaction('kv', mode); const rq = fn(tx.objectStore('kv'));
    tx.oncomplete = () => { db.close(); res(rq && rq.result); }; tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error);
  });
}
const saveMedia = () => idbRun('readwrite', s => s.put(B.media, 'media')).catch(() => {});

async function loadProject() {
  if (B) return B;
  let p = null; try { p = JSON.parse(ls.get(LSK) || 'null'); } catch (e) {}
  let media = []; try { media = (await idbRun('readonly', s => s.get('media'))) || []; } catch (e) {}
  B = { meta: Object.assign({}, DEF_META, p && p.meta), code: (p && p.code) || '', media };
  if (!B.code) B.code = sampleCode();
  return B;
}
function saveNow() { ls.set(LSK, JSON.stringify({ meta: B.meta, code: B.code })); }
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 500); }

/* ------------------------------------------------------------------ helpers */
const L1 = s => { const a = []; for (const ch of String(s)) { const c = ch.codePointAt(0); a.push(c < 256 ? c : 63); } return a; };
const binToBytes = s => { const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; };
const bufToBin = ab => { const u = new Uint8Array(ab); let s = ''; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return s; };
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
const b32 = s => { const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let bits = '', o = ''; for (const c of s) bits += c.charCodeAt(0).toString(2).padStart(8, '0');
  for (let i = 0; i < bits.length; i += 5) o += A[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)]; return o; };
const luaStr = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '') + '"';
const safeId = s => (String(s).replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_]/g, '_').replace(/^(\d)/, '_$1') || 'media');

class BW {
  constructor() { this.p = []; this.n = 0; }
  push(u) { this.p.push(u); this.n += u.length; return this; }
  u8(v) { return this.push(Uint8Array.of(v)); }
  i16(v) { const b = new Uint8Array(2); new DataView(b.buffer).setInt16(0, v, true); return this.push(b); }
  u16(v) { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, v, true); return this.push(b); }
  i32(v) { const b = new Uint8Array(4); new DataView(b.buffer).setInt32(0, v, true); return this.push(b); }
  i64(v) { const b = new Uint8Array(8); new DataView(b.buffer).setBigInt64(0, BigInt(v), true); return this.push(b); }
  f64(v) { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, v, true); return this.push(b); }
  z(s) { return this.push(Uint8Array.from(L1(s).concat([0]))); }
  raw(u) { return this.push(u); }
  bytes() { const o = new Uint8Array(this.n); let k = 0; for (const u of this.p) { o.set(u, k); k += u.length; } return o; }
}

/* ------------------------------------------------------------------ GWC writer (layout verified against real cartridges) */
function buildGWC(meta, luaBin, media) {
  const lua = binToBytes(luaBin), guid = uuid();
  const hb = new BW();
  hb.f64(parseFloat(meta.lat) || 0).f64(parseFloat(meta.lon) || 0).f64(0);
  hb.i64(Math.floor((Date.now() - Date.UTC(2004, 1, 10, 1, 0, 0)) / 1000));          // seconds since 2004-02-10 01:00 UTC
  hb.i16(meta.splash > 0 && meta.splash <= media.length ? meta.splash : -1).i16(meta.icon > 0 && meta.icon <= media.length ? meta.icon : -1);
  hb.z(meta.type || 'Geocache').z('').i64(0).z(meta.name || 'Cartridge').z(guid).z(meta.desc || '').z(meta.startDesc || '')
    .z(meta.version || '1.0').z(meta.author || '').z(meta.company || '').z('Windows PPC');
  const code = b32(guid.replace(/-/g, '').slice(0, 11));
  hb.i32(code.length + 1).z(code);
  const header = hb.bytes();
  const n = 1 + media.length, objStart = 9 + 6 * n + 4 + header.length;
  const objs = [];
  const o0 = new BW().i32(lua.length).raw(lua).bytes(); objs.push(o0);
  media.forEach(m => objs.push(new BW().u8(1).i32(m.type).i32(m.buf.byteLength).raw(new Uint8Array(m.buf)).bytes()));
  const out = new BW();
  out.raw(Uint8Array.of(2, 10, 0x43, 0x41, 0x52, 0x54, 0)).u16(n);
  let off = objStart;
  objs.forEach((o, i) => { out.u16(i).i32(off); off += o.length; });
  out.i32(header.length).raw(header);
  objs.forEach(o => out.raw(o));
  return out.bytes();
}

/* ------------------------------------------------------------------ Lua compiler (Yueliang running inside Moonshine) */
async function getCompiler() {
  if (compilerVm) return compilerVm;
  let r; try { r = await fetch('lcompiler.luac'); if (!r.ok) throw new Error('HTTP ' + r.status); }
  catch (e) { throw new Error(t('b.compilerFail', { m: e.message })); }
  const bin = bufToBin(await r.arrayBuffer());
  const cvm = new shine.VM({});
  await new Promise((res, rej) => cvm.fileManager.load(bin, (err, f) => { if (err) return rej(new Error(String(err))); try { cvm.execute(undefined, f); res(); } catch (e) { rej(e); } }));
  return (compilerVm = cvm);
}
async function compileLua(src) {
  const c = await getCompiler();
  try {
    const r = c._globals['__compile'].apply(null, [unescape(encodeURIComponent(src)), 'cartridge']);
    return Array.isArray(r) ? r[0] : r;
  } catch (e) {
    compilerVm = null;                                   // a failed run may leave the VM in an odd state
    const msg = String(e && (e.message || e)).split('\n')[0];
    const m = /^cartridge:(\d+):\s*(.*)$/.exec(msg);
    const err = new Error(m ? m[2] : msg); err.line = m ? +m[1] : 0; err.compile = true;
    throw err;
  }
}

/* ------------------------------------------------------------------ sample + snippets */
function sampleCode() {
  const et = (typeof lang !== 'undefined' ? lang : 'et') === 'et';
  const m = (B && B.meta) || DEF_META, la = parseFloat(m.lat) || 59.437, lo = parseFloat(m.lon) || 24.7536;
  const f = x => x.toFixed(5);
  const X = et ? {
    c1: '-- Kassett: kõik objektid luuakse kassetile (cartridge) alluvatena.', start: 'Algus', startD: 'Siin algab seiklus. Astu tsooni sisse.', key: 'Võti', keyD: 'Väike messingvõti.',
    look: 'Vaata', take: 'Võta', task: 'Leia võti', taskD: 'Leia ja võta võti.', welcome: 'Tere tulemast! Vaata ümber ja võta võti.', q: 'Kui palju on 2 + 2?', ok: 'Õige!', bad: 'Vale, proovi uuesti.',
    took: 'Võti on nüüd sinu varustuses. Seiklus läbi!', looked: 'Väike messingvõti.' } : {
    c1: '-- Cartridge: every object is created as a child of the cartridge.', start: 'Start', startD: 'The adventure begins here. Walk into the zone.', key: 'Key', keyD: 'A small brass key.',
    look: 'Look', take: 'Take', task: 'Find the key', taskD: 'Find and take the key.', welcome: 'Welcome! Look around and take the key.', q: 'What is 2 + 2?', ok: 'Correct!', bad: 'Wrong, try again.',
    took: 'The key is now in your inventory. Adventure complete!', looked: 'A small brass key.' };
  return `require "Wherigo"

${X.c1}
cartridge = Wherigo.ZCartridge()

zStart = Wherigo.Zone(cartridge)
zStart.Name = ${luaStr(X.start)}
zStart.Description = ${luaStr(X.startD)}
zStart.Visible = true
zStart.Active = true
zStart.ShowObjects = "OnEnter"
zStart.Points = {
  Wherigo.ZonePoint(${f(la + 0.0004)}, ${f(lo - 0.0006)}, 0),
  Wherigo.ZonePoint(${f(la + 0.0004)}, ${f(lo + 0.0006)}, 0),
  Wherigo.ZonePoint(${f(la - 0.0004)}, ${f(lo + 0.0006)}, 0),
  Wherigo.ZonePoint(${f(la - 0.0004)}, ${f(lo - 0.0006)}, 0)
}

iKey = Wherigo.ZItem(cartridge)
iKey.Name = ${luaStr(X.key)}
iKey.Description = ${luaStr(X.keyD)}
iKey.Visible = true
iKey.Container = zStart
iKey.Commands = {
  Look = Wherigo.ZCommand{ Text = ${luaStr(X.look)}, CmdWith = false, Enabled = true },
  Take = Wherigo.ZCommand{ Text = ${luaStr(X.take)}, CmdWith = false, Enabled = true }
}

tFind = Wherigo.ZTask(cartridge)
tFind.Name = ${luaStr(X.task)}
tFind.Description = ${luaStr(X.taskD)}
tFind.Visible = true
tFind.Active = true

inpQ = Wherigo.ZInput(cartridge)
inpQ.Name = "Question"
inpQ.InputType = "Text"
inpQ.Text = ${luaStr(X.q)}

function iKey:OnLook()
  Wherigo.MessageBox{ Text = ${luaStr(X.looked)} }
end

function iKey:OnTake()
  iKey:MoveTo(Wherigo.Player)
  tFind.Complete = true
  Wherigo.MessageBox{ Text = ${luaStr(X.took)} }
  cartridge.Complete = true
end

function zStart:OnEnter()
  Wherigo.MessageBox{ Text = ${luaStr(X.welcome)}, Callback = function() Wherigo.GetInput(inpQ) end }
end

function inpQ:OnGetInput(input)
  if Wherigo.NoCaseEquals(input, "4") then
    Wherigo.MessageBox{ Text = ${luaStr(X.ok)} }
  else
    Wherigo.MessageBox{ Text = ${luaStr(X.bad)}, Callback = function() Wherigo.GetInput(inpQ) end }
  end
end

return cartridge
`;
}

const SNIPPETS = {
  'Zone': `zNew = Wherigo.Zone(cartridge)
zNew.Name = "Zone name"
zNew.Description = ""
zNew.Visible = true
zNew.Active = true
zNew.ShowObjects = "OnEnter"
zNew.ProximityRange = Wherigo.Distance(50, "m")
zNew.Points = {
  Wherigo.ZonePoint(59.43700, 24.75300, 0),
  Wherigo.ZonePoint(59.43700, 24.75500, 0),
  Wherigo.ZonePoint(59.43600, 24.75400, 0)
}
function zNew:OnEnter()
  Wherigo.MessageBox{ Text = "You are here." }
end
`,
  'Item': `iNew = Wherigo.ZItem(cartridge)
iNew.Name = "Item name"
iNew.Description = ""
iNew.Visible = true
iNew.Container = zStart   -- a zone, Wherigo.Player or nil
iNew.Commands = { Use = Wherigo.ZCommand{ Text = "Use", CmdWith = false, Enabled = true } }
function iNew:OnUse()
  Wherigo.MessageBox{ Text = "Nothing happens." }
end
`,
  'Command (with target)': `iTool.Commands = { UseOn = Wherigo.ZCommand{ Text = "Use on", CmdWith = true, Enabled = true, WorksWithAll = true } }
function iTool:OnUseOn(target)
  Wherigo.MessageBox{ Text = "You use it on " .. tostring(target and target.Name) }
end
`,
  'Character': `cNew = Wherigo.ZCharacter(cartridge)
cNew.Name = "Character name"
cNew.Description = ""
cNew.Visible = true
cNew.Container = zStart
cNew.Commands = { Talk = Wherigo.ZCommand{ Text = "Talk", CmdWith = false, Enabled = true } }
function cNew:OnTalk()
  Wherigo.Dialog{
    { Text = "Hello, traveller." },
    { Text = "Have you seen the key?", Buttons = { "Yes", "No" }, Callback = function(v) end }
  }
end
`,
  'Task': `tNew = Wherigo.ZTask(cartridge)
tNew.Name = "Task name"
tNew.Description = ""
tNew.Visible = true
tNew.Active = true
-- later: tNew.Complete = true
`,
  'Timer': `tmNew = Wherigo.ZTimer(cartridge)
tmNew.Name = "Timer"
tmNew.Type = "Countdown"
tmNew.Duration = 60   -- seconds
function tmNew:OnTick() end
function tmNew:OnElapsed()
  Wherigo.MessageBox{ Text = "Time is up!" }
end
-- tmNew:Start()
`,
  'Input (text)': `inNew = Wherigo.ZInput(cartridge)
inNew.Name = "Question"
inNew.InputType = "Text"
inNew.Text = "Your question?"
function inNew:OnGetInput(input)
  if Wherigo.NoCaseEquals(input, "answer") then
    Wherigo.MessageBox{ Text = "Correct!" }
  else
    Wherigo.MessageBox{ Text = "Wrong." }
  end
end
-- Wherigo.GetInput(inNew)
`,
  'Input (multiple choice)': `inChoice = Wherigo.ZInput(cartridge)
inChoice.Name = "Choice"
inChoice.InputType = "MultipleChoice"
inChoice.Choices = { "Red", "Green", "Blue" }
inChoice.Text = "Pick a colour"
function inChoice:OnGetInput(input)
  Wherigo.MessageBox{ Text = "You picked " .. tostring(input) }
end
-- Wherigo.GetInput(inChoice)
`,
  'Message with buttons': `Wherigo.MessageBox{
  Text = "Do you want to continue?",
  Buttons = { "Yes", "No" },
  Callback = function(value)
    if value == "Yes" then
      -- ...
    end
  end
}
`,
  'Distance to zone': `local d = Wherigo.VectorToZone(Wherigo.Player.ObjectLocation, zStart)
-- d.distance is a Distance: d.distance("m")  (metres)
Wherigo.MessageBox{ Text = "Distance: " .. math.floor(d.distance("m")) .. " m" }
`,
  'Play sound': `Wherigo.PlayAudio(media_1)   -- media_1 = a ZMedia (see "Insert media Lua code")
`
};

function mediaSnippet() {
  if (!B.media.length) return '';
  return B.media.map((m, i) => `${safeId(m.name)} = Wherigo.ZMedia(cartridge)   -- media number ${i + 1}
${safeId(m.name)}.Name = ${luaStr(m.name)}
${safeId(m.name)}.Resources = { { Type = "${TYPENAME[m.type]}", Filename = ${luaStr(m.name)}, Directives = {} } }
`).join('\n');
}

const REF = `Wherigo.ZCartridge()  Wherigo.Zone(c)  Wherigo.ZItem(c)  Wherigo.ZCharacter(c)  Wherigo.ZTask(c)  Wherigo.ZTimer(c)  Wherigo.ZInput(c)  Wherigo.ZMedia(c)
Wherigo.ZCommand{Text=, CmdWith=, Enabled=, WorksWithAll=}
Wherigo.ZonePoint(lat, lon, alt)  Wherigo.Distance(value, "m"|"km"|"ft"|"mi"|"nm")
Wherigo.MessageBox{Text=, Media=, Buttons={}, Callback=fn}   Wherigo.Dialog{ {Text=...}, ... }
Wherigo.GetInput(input)   Wherigo.ShowScreen(Wherigo.MAINSCREEN | LOCATIONSCREEN | ITEMSCREEN | INVENTORYSCREEN | TASKSCREEN | DETAILSCREEN, obj)
Wherigo.PlayAudio(media)  Wherigo.LogMessage(text)  Wherigo.NoCaseEquals(a, b)  Wherigo.Player  Wherigo.Player.ObjectLocation
Wherigo.VectorToZone(point, zone)  Wherigo.VectorToPoint(a, b)  Wherigo.TranslatePoint(point, distance, bearing)
obj.Name  .Description  .Visible  .Active  .Container  .Commands  obj:MoveTo(container)  obj:Contains(other)
Zone: .Points  .State  .ProximityRange  .ShowObjects   events OnEnter OnExit OnProximity OnDistant OnOutOfRange
Task: .Complete  .CorrectState ("Correct"|"NotCorrect")   Timer: .Type .Duration :Start() :Stop() :Reset()  OnTick OnElapsed OnStart OnStop
Cartridge: function cartridge:OnStart()  function cartridge:OnRestore()  cartridge.Complete = true (shows the end screen)
Events fire on property change too: OnSetActive OnSetVisible OnSetComplete OnSetCorrectState`;

/* ------------------------------------------------------------------ UI */
const css = document.createElement('style');
css.textContent = `
.bld h2{margin:.2em 0 .4em} .bld details{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:10px 0}
.bld summary{font-weight:600;cursor:pointer} .bld label{display:block;font-size:.8rem;color:var(--muted);margin:10px 0 3px}
.bld input[type=text],.bld input[type=number],.bld select,.bld textarea.plain{width:100%;font:inherit;padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)}
.bld textarea.plain{min-height:70px;resize:vertical} .bld .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.bld .editor{display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--bg);height:55vh;min-height:280px}
.bld .gut{width:3.2em;overflow:hidden;background:var(--surface);color:var(--muted);text-align:right;padding:8px 6px 8px 0;font:13px/20px ui-monospace,Menlo,Consolas,monospace;white-space:pre;user-select:none}
.bld #code{flex:1;border:0;outline:0;resize:none;padding:8px;font:13px/20px ui-monospace,Menlo,Consolas,monospace;background:transparent;color:var(--ink);white-space:pre;overflow:auto;tab-size:2}
.bld .row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;align-items:center}
.bld .mitem{display:flex;gap:8px;align-items:center;border-top:1px solid var(--line);padding:6px 0;font-size:.9rem} .bld .mitem b{min-width:1.6em} .bld .mitem span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bld .status{margin:8px 0;font-size:.9rem;white-space:pre-wrap} .bld .status.err{color:var(--warn)} .bld .status a{color:inherit;text-decoration:underline;cursor:pointer}
.bld pre.ref{font-size:.75rem;overflow:auto;white-space:pre;margin:8px 0 0}
`;
document.head.appendChild(css);

const typeOpts = sel => TYPES.map(x => `<option${x === sel ? ' selected' : ''}>${x}</option>`).join('');
const mediaOpts = sel => `<option value="0">${esc(t('b.none'))}</option>` + B.media.map((m, i) => `<option value="${i + 1}"${sel === i + 1 ? ' selected' : ''}>${i + 1}. ${esc(m.name)}</option>`).join('');

function lineNumbers() { const n = B.code.split('\n').length; let s = ''; for (let i = 1; i <= n; i++) s += i + '\n'; return s; }

function renderMedia() {
  const box = $('#bMediaList'); if (!box) return;
  box.innerHTML = B.media.length ? B.media.map((m, i) => `<div class="mitem"><b>${i + 1}</b><span>${esc(m.name)} · ${TYPENAME[m.type]} · ${(m.buf.byteLength / 1024).toFixed(0)} KB</span>
    <button class="btn sm ghost" data-a="up" data-i="${i}" aria-label="${esc(t('b.up'))}">↑</button><button class="btn sm ghost" data-a="down" data-i="${i}" aria-label="${esc(t('b.down'))}">↓</button>
    <button class="btn sm ghost" data-a="rm" data-i="${i}" aria-label="${esc(t('b.remove'))}">✕</button></div>`).join('') : `<p class="muted small">${t('b.noMedia')}</p>`;
  box.querySelectorAll('button').forEach(b => b.onclick = () => {
    const i = +b.dataset.i, a = b.dataset.a, M = B.media;
    const remap = old => old === 0 ? 0 : (a === 'rm' ? (old === i + 1 ? 0 : old > i + 1 ? old - 1 : old) : (old === i + 1 ? (a === 'up' ? i : i + 2) : old === (a === 'up' ? i : i + 2) ? i + 1 : old));
    if (a === 'rm') M.splice(i, 1);
    else if (a === 'up' && i > 0) [M[i - 1], M[i]] = [M[i], M[i - 1]];
    else if (a === 'down' && i < M.length - 1) [M[i + 1], M[i]] = [M[i], M[i + 1]];
    else return;
    B.meta.splash = remap(B.meta.splash); B.meta.icon = remap(B.meta.icon);
    saveMedia(); saveNow(); renderMedia();
    $('#bSplash').innerHTML = mediaOpts(B.meta.splash); $('#bIcon').innerHTML = mediaOpts(B.meta.icon);
  });
}

function setStatus(html, err) { const s = $('#bStatus'); if (!s) return; s.className = 'status' + (err ? ' err' : ''); s.innerHTML = html; }
function gotoLine(n) {
  const ta = $('#code'); const lines = B.code.split('\n'); let pos = 0;
  for (let i = 0; i < n - 1 && i < lines.length; i++) pos += lines[i].length + 1;
  ta.focus(); ta.setSelectionRange(pos, pos + (lines[n - 1] || '').length); ta.scrollTop = Math.max(0, (n - 4) * 20);
  $('#gut').scrollTop = ta.scrollTop;
}
function showError(e) {
  const where = e.line ? `<a data-line="${e.line}">${esc(t('b.line', { n: e.line }))}</a>: ` : '';
  setStatus(where + esc(e.message || String(e)), true);
  const a = $('#bStatus a'); if (a) a.onclick = () => gotoLine(+a.dataset.line);
}

async function doCompile() {
  if (busy) return null; busy = true;
  setStatus(esc(t('b.busy')));
  try {
    await new Promise(r => setTimeout(r, 30));
    return await compileLua(B.code);
  } catch (e) { showError(e); return null; }
  finally { busy = false; }
}

function playerMedias() {
  const o = {}; B.media.forEach((m, i) => { o[i + 1] = { type: m.type, mime: MIMEOF[m.type], blob: new Blob([m.buf], { type: MIMEOF[m.type] }) }; }); return o;
}

function exportProject() {
  const b64 = ab => btoa(bufToBin(ab));
  const data = JSON.stringify({ wheremego: 1, meta: B.meta, code: B.code, media: B.media.map(m => ({ name: m.name, type: m.type, data: b64(m.buf) })) });
  download(new Blob([data], { type: 'application/json' }), (B.meta.name || 'cartridge').replace(/[^\w\-]+/g, '_') + '.wmg.json');
}
async function importProject(file) {
  try {
    const p = JSON.parse(await file.text()); if (!p || p.wheremego !== 1) throw new Error('not a WhereMeGo project');
    B = { meta: Object.assign({}, DEF_META, p.meta), code: String(p.code || ''),
      media: (p.media || []).map(m => ({ name: m.name, type: m.type, buf: binToBytes(atob(m.data)).buffer })) };
    saveNow(); await saveMedia(); render();
  } catch (e) { setStatus(esc(t('b.importBad', { m: e.message })), true); }
}
function download(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
}

function renderBuilder(v) {
  const m = B.meta;
  v.innerHTML = `<div class="bld"><button class="back" id="bBack">${t('b.back')}</button><h2>${t('b.title')}</h2>
  <details open><summary>${t('b.info')}</summary>
    <label>${t('b.name')}</label><input type="text" id="bName" value="${esc(m.name)}">
    <div class="two"><div><label>${t('b.author')}</label><input type="text" id="bAuthor" value="${esc(m.author)}"></div><div><label>${t('b.company')}</label><input type="text" id="bCompany" value="${esc(m.company)}"></div></div>
    <label>${t('b.desc')}</label><textarea class="plain" id="bDesc">${esc(m.desc)}</textarea>
    <label>${t('b.startDesc')}</label><textarea class="plain" id="bStartDesc">${esc(m.startDesc)}</textarea>
    <div class="two"><div><label>${t('b.version')}</label><input type="text" id="bVersion" value="${esc(m.version)}"></div><div><label>${t('b.type')}</label><select id="bType">${typeOpts(m.type)}</select></div></div>
    <div class="two"><div><label>${t('b.lat')}</label><input type="text" inputmode="decimal" id="bLat" value="${esc(m.lat)}"></div><div><label>${t('b.lon')}</label><input type="text" inputmode="decimal" id="bLon" value="${esc(m.lon)}"></div></div>
    <div class="row"><button class="btn sm ghost" id="bHere">${t('b.here')}</button></div>
    <div class="two"><div><label>${t('b.splash')}</label><select id="bSplash">${mediaOpts(m.splash)}</select></div><div><label>${t('b.icon')}</label><select id="bIcon">${mediaOpts(m.icon)}</select></div></div>
  </details>
  <details><summary>${t('b.media')}</summary><p class="muted small">${t('b.mediaHelp')}</p><div id="bMediaList"></div>
    <div class="row"><button class="btn sm" id="bAddMedia">${t('b.addMedia')}</button><button class="btn sm ghost" id="bMediaSnip">${t('b.mediaSnip')}</button></div>
    <input type="file" id="bMediaFile" multiple accept=".png,.jpg,.jpeg,.gif,.bmp,.wav,.mp3,.ogg,image/*,audio/*" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" tabindex="-1">
  </details>
  <details open><summary>${t('b.code')}</summary>
    <div class="row"><button class="btn sm ghost" id="bSample">${t('b.sample')}</button>
      <select id="bSnip" style="width:auto;flex:1"><option value="">${t('b.snip')}</option>${Object.keys(SNIPPETS).map(k => `<option>${k}</option>`).join('')}</select></div>
    <div class="editor"><div class="gut" id="gut"></div><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div>
    <p class="muted small" style="margin:6px 0 0">${t('b.hint')}</p>
    <div class="row"><button class="btn" id="bCompile">${t('b.compile')}</button><button class="btn" id="bTest">${t('b.test')}</button><button class="btn" id="bSave">${t('b.save')}</button></div>
    <div class="status" id="bStatus" role="status"></div>
  </details>
  <details><summary>${t('b.ref')}</summary><pre class="ref">${esc(REF)}</pre></details>
  <div class="row"><button class="btn sm ghost" id="bExport">${t('b.export')}</button><button class="btn sm ghost" id="bImport">${t('b.import')}</button><button class="btn sm ghost" id="bNew">${t('b.newProj')}</button>
    <input type="file" id="bImportFile" accept=".json,application/json" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" tabindex="-1"></div>
  <p class="muted small">${t('b.autosave')}</p>
  <p>${coffeeLink()}</p></div>`;

  const ta = $('#code'), gut = $('#gut'); ta.value = B.code; gut.textContent = lineNumbers(); renderMedia();
  const bind = (id, key, num) => { $(id).oninput = $(id).onchange = e => { B.meta[key] = num ? +e.target.value : e.target.value; scheduleSave(); }; };
  bind('#bName', 'name'); bind('#bAuthor', 'author'); bind('#bCompany', 'company'); bind('#bDesc', 'desc'); bind('#bStartDesc', 'startDesc'); bind('#bVersion', 'version');
  bind('#bType', 'type'); bind('#bLat', 'lat'); bind('#bLon', 'lon'); bind('#bSplash', 'splash', true); bind('#bIcon', 'icon', true);
  ta.oninput = () => { B.code = ta.value; gut.textContent = lineNumbers(); scheduleSave(); };
  ta.onscroll = () => { gut.scrollTop = ta.scrollTop; };
  ta.onkeydown = e => { if (e.key === 'Tab') { e.preventDefault(); insertAtCursor('  '); } };
  const insertAtCursor = txt => { ta.focus(); const s = ta.selectionStart, en = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + txt + ta.value.slice(en); ta.selectionStart = ta.selectionEnd = s + txt.length; ta.oninput(); };

  $('#bBack').onclick = () => { saveNow(); state.tab = 'start'; render(); };
  $('#bHere').onclick = () => {
    const use = p => { B.meta.lat = p.lat.toFixed(5); B.meta.lon = p.lon.toFixed(5); $('#bLat').value = B.meta.lat; $('#bLon').value = B.meta.lon; saveNow(); };
    if (state.pos) return use(state.pos);
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(p => use({ lat: p.coords.latitude, lon: p.coords.longitude }), e => setStatus(esc(e.message), true), { enableHighAccuracy: true, timeout: 15000 });
  };
  $('#bAddMedia').onclick = () => $('#bMediaFile').click();
  $('#bMediaFile').onchange = async e => {
    for (const f of e.target.files) {
      const ext = (f.name.split('.').pop() || '').toLowerCase(); const type = MT[ext];
      if (!type) { setStatus(esc(t('b.mediaBad', { n: f.name })), true); continue; }
      B.media.push({ name: f.name, type, buf: await f.arrayBuffer() });
    }
    e.target.value = ''; await saveMedia(); renderMedia(); $('#bSplash').innerHTML = mediaOpts(B.meta.splash); $('#bIcon').innerHTML = mediaOpts(B.meta.icon);
  };
  $('#bMediaSnip').onclick = () => { if (B.media.length) insertAtCursor(mediaSnippet() + '\n'); };
  $('#bSample').onclick = () => { if (!B.code.trim() || confirm(t('b.confirmSample'))) { B.code = sampleCode(); ta.value = B.code; gut.textContent = lineNumbers(); scheduleSave(); } };
  $('#bSnip').onchange = e => { const s = SNIPPETS[e.target.value]; if (s) insertAtCursor('\n' + s); e.target.value = ''; };
  $('#bCompile').onclick = async () => { const b = await doCompile(); if (b) setStatus(esc(t('b.okCompile', { n: b.length }))); };
  $('#bSave').onclick = async () => {
    const b = await doCompile(); if (!b) return;
    const bytes = buildGWC(B.meta, b, B.media);
    const fname = (B.meta.name || 'cartridge').replace(/[^\w\-]+/g, '_') + '.gwc';
    download(new Blob([bytes], { type: 'application/octet-stream' }), fname);
    setStatus(esc(t('b.saved', { f: fname, n: Math.round(bytes.length / 1024) })));
  };
  $('#bTest').onclick = async () => {
    const b = await doCompile(); if (!b) return;
    try {
      saveNow(); state.fromBuilder = true;
      await startCartridge({ lua: b, medias: playerMedias(), count: 1 + B.media.length });
      ls.del('wherigo:' + state.key); ls.del('wheremego:done:' + state.key); render();
    } catch (e) { state.fromBuilder = false; stopAll(); vm = null; state.tab = 'builder'; render(); setStatus(esc(t('b.runErr', { m: e.message || e })), true); }
  };
  $('#bExport').onclick = exportProject;
  $('#bImport').onclick = () => $('#bImportFile').click();
  $('#bImportFile').onchange = e => { if (e.target.files[0]) importProject(e.target.files[0]); };
  $('#bNew').onclick = async () => {
    if (!confirm(t('b.confirmNew'))) return;
    B = { meta: Object.assign({}, DEF_META), code: '', media: [] }; B.code = sampleCode(); saveNow(); await saveMedia(); render();
  };
}

window.WMGBuilder = {
  render(v) {
    if (!B) { v.innerHTML = `<p class="muted">${t('hist.loading')}</p>`; loadProject().then(() => { if (state.tab === 'builder') render(); }); return; }
    renderBuilder(v);
  },
  buildGWC, compileLua
};
})();
