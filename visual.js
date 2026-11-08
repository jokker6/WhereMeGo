/* WhereMeGo visual adventure editor: a no-code model (zones, items, characters, tasks, timers, questions + actions)
   that is turned into Wherigo Lua. Loaded by builder.js; uses app globals (I18N, t, esc, lang, state, L ...). */
(function () {
'use strict';

Object.assign(I18N.et, {
 'v.start':'Seikluse algus','v.startHint':'Mida juhtub kohe, kui mäng algab.','v.when':'Siis',
 'v.zones':'Asukohad','v.items':'Esemed','v.chars':'Tegelased','v.tasks':'Ülesanded','v.timers':'Taimerid','v.qs':'Küsimused',
 'v.addZone':'+ Lisa asukoht','v.addItem':'+ Lisa ese','v.addChar':'+ Lisa tegelane','v.addTask':'+ Lisa ülesanne','v.addTimer':'+ Lisa taimer','v.addQ':'+ Lisa küsimus',
 'v.newZone':'Asukoht','v.newItem':'Ese','v.newChar':'Tegelane','v.newTask':'Ülesanne','v.newTimer':'Taimer','v.newQ':'Küsimus',
 'v.name':'Nimi','v.desc':'Kirjeldus','v.visible':'Nähtav alguses','v.active':'Aktiivne alguses','v.del':'Kustuta','v.delConfirm':'Kustutan «{n}»?',
 'v.lat':'Laiuskraad','v.lon':'Pikkuskraad','v.radius':'Raadius (m)','v.pick':'🗺 Vali kaardilt','v.here':'📍 Minu asukoht','v.mapOk':'Kasuta seda kohta','v.mapHint':'Puuduta kaarti, et asukoht valida.',
 'v.onEnter':'Kui mängija siseneb asukohta','v.onExit':'Kui mängija lahkub asukohast','v.onElapsed':'Kui aeg saab täis','v.secs':'Kestus (sekundit)',
 'v.where':'Alguses asub','v.wherePlayer':'mängija varustuses','v.whereNone':'ei kusagil (ilmub hiljem)','v.whereZone':'asukohas «{n}»',
 'v.cmds':'Nupud (mida mängija saab teha)','v.addCmd':'+ Lisa nupp','v.cmdName':'Nupu tekst','v.cmdWhen':'Kui mängija vajutab nuppu «{n}»','v.cmdLook':'Vaata','v.cmdTake':'Võta',
 'v.qText':'Küsimuse tekst','v.qType':'Vastamise viis','v.qTypeText':'Mängija kirjutab vastuse','v.qTypeChoice':'Mängija valib variandi','v.qMedia':'Pilt',
 'v.answers':'Vastused','v.addAns':'+ Lisa õige vastus','v.ansMatch':'Õige vastus (mitu varianti eralda märgiga |)','v.ansWhen':'Kui vastus on «{m}»','v.elseWhen':'Kui vastus on mõni muu',
 'v.choices':'Variandid','v.addChoice':'+ Lisa variant','v.choiceWhen':'Kui valitakse «{m}»','v.choiceText':'Variandi tekst',
 'v.addAct':'+ Lisa tegevus …','v.noActs':'Pole veel tegevusi.','v.none':'– vali –','v.nothing':'(pole veel lisatud)',
 'a.msg':'Näita teadet','a.ask':'Esita küsimus','a.give':'Anna ese mängijale','a.remove':'Võta ese mängijalt ära','a.place':'Pane ese asukohta','a.vis':'Muuda nähtavust','a.act':'Aktiveeri või peata',
 'a.task':'Märgi ülesanne','a.timer':'Taimer','a.sound':'Mängi heli','a.finish':'Lõpeta seiklus','a.set':'Muutuja','a.if':'Kui …, siis …',
 'a.text':'Tekst','a.picture':'pilt/heli','a.item':'ese','a.zone':'asukoht','a.question':'küsimus','a.show':'näita','a.hide':'peida','a.on':'aktiivne','a.off':'passiivne',
 'a.done':'tehtud','a.failed':'ebaõnnestunud','a.start':'käivita','a.stop':'peata','a.setTo':'määra väärtuseks','a.addTo':'lisa juurde','a.varName':'muutuja nimi','a.value':'väärtus',
 'a.then':'Siis','a.else':'Muidu','a.addElse':'+ Muidu-haru','a.object':'objekt','a.task2':'ülesanne','a.timer2':'taimer','a.media':'meedia',
 'c.has':'mängijal on ese','c.nothas':'mängijal pole eset','c.taskdone':'ülesanne on tehtud','c.tasknot':'ülesanne pole tehtud','c.eq':'muutuja on võrdne','c.gt':'muutuja on suurem kui','c.lt':'muutuja on väiksem kui',
 's.title':'Seikluse kokkuvõte sõnadega','s.empty':'Seiklus on tühi.','s.start':'Kui mäng algab','s.enter':'Kui sisened asukohta «{n}»','s.exit':'Kui lahkud asukohast «{n}»','s.cmd':'Kui vajutad «{c}» ({n})','s.elapsed':'Kui taimer «{n}» saab täis',
 's.ans':'Küsimus «{n}»: vastus «{m}»','s.else':'Küsimus «{n}»: muu vastus','s.choice':'Küsimus «{n}»: valitakse «{m}»','s.noacts':'ei midagi',
 't.msg':'näita teadet «{x}»','t.ask':'esita küsimus «{x}»','t.give':'anna ese «{x}» mängijale','t.remove':'võta ese «{x}» mängijalt ära','t.place':'pane ese «{x}» asukohta «{y}»','t.vis':'{y} «{x}»','t.act':'{y} «{x}»',
 't.task':'märgi ülesanne «{x}» {y}','t.timer':'{y} taimer «{x}»','t.sound':'mängi heli {x}','t.finish':'lõpeta seiklus','t.set':'muutuja «{x}»: {y}','t.if':'kui {x}, siis [{y}]','t.else':', muidu [{y}]',
 'sample':'Näidisseiklus','sample.confirm':'Asendan praeguse seikluse näitega?','v.warnNoPos':'Asukohal «{n}» pole koordinaate.',
 'adv.lua':'Täpsem: kirjuta Lua koodi ise','adv.luaConfirm':'Lülitun Lua koodi režiimi. Praegune seiklus muudetakse koodiks ja seda saab edasi muuta ainult koodina. Jätkan?','adv.visual':'Tagasi sõnalisse ehitajasse',
 'adv.visualConfirm':'Lua koodi muudatused lähevad kaotsi ja alustad sõnalise ehitaja viimasest seisust. Jätkan?','adv.showLua':'Näita loodud Lua koodi','adv.mode':'Praegu on Lua koodi režiim.'
});
Object.assign(I18N.en, {
 'v.start':'Adventure start','v.startHint':'What happens as soon as the game starts.','v.when':'Then',
 'v.zones':'Locations','v.items':'Items','v.chars':'Characters','v.tasks':'Tasks','v.timers':'Timers','v.qs':'Questions',
 'v.addZone':'+ Add location','v.addItem':'+ Add item','v.addChar':'+ Add character','v.addTask':'+ Add task','v.addTimer':'+ Add timer','v.addQ':'+ Add question',
 'v.newZone':'Location','v.newItem':'Item','v.newChar':'Character','v.newTask':'Task','v.newTimer':'Timer','v.newQ':'Question',
 'v.name':'Name','v.desc':'Description','v.visible':'Visible at start','v.active':'Active at start','v.del':'Delete','v.delConfirm':'Delete "{n}"?',
 'v.lat':'Latitude','v.lon':'Longitude','v.radius':'Radius (m)','v.pick':'🗺 Pick on map','v.here':'📍 My location','v.mapOk':'Use this spot','v.mapHint':'Tap the map to choose the location.',
 'v.onEnter':'When the player enters the location','v.onExit':'When the player leaves the location','v.onElapsed':'When the time runs out','v.secs':'Duration (seconds)',
 'v.where':'At the start it is','v.wherePlayer':'in the player\'s inventory','v.whereNone':'nowhere (appears later)','v.whereZone':'at location "{n}"',
 'v.cmds':'Buttons (what the player can do)','v.addCmd':'+ Add button','v.cmdName':'Button text','v.cmdWhen':'When the player presses "{n}"','v.cmdLook':'Look','v.cmdTake':'Take',
 'v.qText':'Question text','v.qType':'How to answer','v.qTypeText':'Player types the answer','v.qTypeChoice':'Player picks an option','v.qMedia':'Picture',
 'v.answers':'Answers','v.addAns':'+ Add correct answer','v.ansMatch':'Correct answer (separate variants with |)','v.ansWhen':'When the answer is "{m}"','v.elseWhen':'When the answer is anything else',
 'v.choices':'Options','v.addChoice':'+ Add option','v.choiceWhen':'When "{m}" is chosen','v.choiceText':'Option text',
 'v.addAct':'+ Add action …','v.noActs':'No actions yet.','v.none':'– choose –','v.nothing':'(none added yet)',
 'a.msg':'Show a message','a.ask':'Ask a question','a.give':'Give item to player','a.remove':'Take item from player','a.place':'Put item at location','a.vis':'Change visibility','a.act':'Activate or stop',
 'a.task':'Mark a task','a.timer':'Timer','a.sound':'Play a sound','a.finish':'Finish the adventure','a.set':'Variable','a.if':'If … then …',
 'a.text':'Text','a.picture':'picture/sound','a.item':'item','a.zone':'location','a.question':'question','a.show':'show','a.hide':'hide','a.on':'active','a.off':'inactive',
 'a.done':'done','a.failed':'failed','a.start':'start','a.stop':'stop','a.setTo':'set to','a.addTo':'add','a.varName':'variable name','a.value':'value',
 'a.then':'Then','a.else':'Otherwise','a.addElse':'+ Otherwise branch','a.object':'object','a.task2':'task','a.timer2':'timer','a.media':'media',
 'c.has':'the player has item','c.nothas':'the player does not have item','c.taskdone':'task is done','c.tasknot':'task is not done','c.eq':'variable equals','c.gt':'variable is greater than','c.lt':'variable is less than',
 's.title':'Adventure summary in words','s.empty':'The adventure is empty.','s.start':'When the game starts','s.enter':'When you enter location "{n}"','s.exit':'When you leave location "{n}"','s.cmd':'When you press "{c}" ({n})','s.elapsed':'When timer "{n}" runs out',
 's.ans':'Question "{n}": answer "{m}"','s.else':'Question "{n}": any other answer','s.choice':'Question "{n}": "{m}" is chosen','s.noacts':'nothing',
 't.msg':'show message "{x}"','t.ask':'ask question "{x}"','t.give':'give item "{x}" to the player','t.remove':'take item "{x}" from the player','t.place':'put item "{x}" at location "{y}"','t.vis':'{y} "{x}"','t.act':'{y} "{x}"',
 't.task':'mark task "{x}" as {y}','t.timer':'{y} timer "{x}"','t.sound':'play sound {x}','t.finish':'finish the adventure','t.set':'variable "{x}": {y}','t.if':'if {x}, then [{y}]','t.else':', otherwise [{y}]',
 'sample':'Sample adventure','sample.confirm':'Replace the current adventure with the sample?','v.warnNoPos':'Location "{n}" has no coordinates.',
 'adv.lua':'Advanced: write Lua code yourself','adv.luaConfirm':'Switch to Lua code mode. The current adventure is turned into code and can only be edited as code from then on. Continue?','adv.visual':'Back to the word-based builder',
 'adv.visualConfirm':'Your Lua code changes are lost and you continue from the last state of the word-based builder. Continue?','adv.showLua':'Show generated Lua code','adv.mode':'Lua code mode is on.'
});

/* ------------------------------------------------------------------ model */
const KINDS = { z: 'zones', i: 'items', c: 'chars', k: 'tasks', m: 'timers', q: 'qs' };
const ACT_TYPES = ['msg', 'ask', 'give', 'remove', 'place', 'vis', 'act', 'task', 'timer', 'sound', 'finish', 'set', 'if'];
const COND_KINDS = ['has', 'nothas', 'taskdone', 'tasknot', 'eq', 'gt', 'lt'];
let V = null, host = null;           // V = project model, host = { B, media(), onChange(), box }

const nid = () => V.nid++;
const find = (kind, id) => V[KINDS[kind]].find(o => o.id === +id) || null;

function newV() { return { start: [], zones: [], items: [], chars: [], tasks: [], timers: [], qs: [], nid: 1 }; }
function defAct(type) {
  switch (type) {
    case 'msg': return { t: 'msg', text: '', media: 0 };
    case 'ask': return { t: 'ask', q: 0 };
    case 'give': return { t: 'give', item: 0 };
    case 'remove': return { t: 'remove', item: 0 };
    case 'place': return { t: 'place', item: 0, zone: 0 };
    case 'vis': return { t: 'vis', ref: '', on: true };
    case 'act': return { t: 'act', ref: '', on: true };
    case 'task': return { t: 'task', task: 0, state: 'done' };
    case 'timer': return { t: 'timer', timer: 0, op: 'start' };
    case 'sound': return { t: 'sound', media: 0 };
    case 'finish': return { t: 'finish' };
    case 'set': return { t: 'set', name: '', op: 'set', val: '' };
    case 'if': return { t: 'if', cond: { k: 'has', ref: 0, name: '', val: '' }, then: [], else: null };
  }
}
function newObj(kind) {
  const m = host.B.meta, id = nid(), n = (V[KINDS[kind]].length + 1), base = { id, name: t('v.new' + { z: 'Zone', i: 'Item', c: 'Char', k: 'Task', m: 'Timer', q: 'Q' }[kind]) + ' ' + n };
  switch (kind) {
    case 'z': return Object.assign(base, { desc: '', lat: m.lat, lon: m.lon, r: 30, visible: true, active: true, enter: [], exit: [] });
    case 'i': return Object.assign(base, { desc: '', where: 'none', visible: true, cmds: [] });
    case 'c': return Object.assign(base, { desc: '', where: 'none', visible: true, cmds: [] });
    case 'k': return Object.assign(base, { desc: '', visible: true, active: true });
    case 'm': return Object.assign(base, { secs: 60, acts: [] });
    case 'q': return Object.assign(base, { text: '', type: 'text', media: 0, answers: [], else: [{ t: 'msg', text: lang === 'et' ? 'Vale vastus, proovi uuesti.' : 'Wrong answer, try again.', media: 0 }], choices: [] });
  }
}
function sampleVis() {
  const et = lang === 'et', m = host.B.meta;
  const v = newV(); const old = V; V = v;
  const z = Object.assign(newObj('z'), { name: et ? 'Algus' : 'Start', desc: et ? 'Siin algab seiklus.' : 'The adventure begins here.' });
  const q = newObj('q'); Object.assign(q, { name: et ? 'Kontrollküsimus' : 'Check question', text: et ? 'Kui palju on 2 + 2?' : 'What is 2 + 2?' });
  const it = newObj('i'); Object.assign(it, { name: et ? 'Võti' : 'Key', desc: et ? 'Väike messingvõti.' : 'A small brass key.', where: 'z' + z.id });
  const task = newObj('k'); Object.assign(task, { name: et ? 'Leia võti' : 'Find the key', desc: et ? 'Leia ja võta võti.' : 'Find and take the key.' });
  it.cmds = [
    { name: et ? 'Vaata' : 'Look', acts: [{ t: 'msg', text: et ? 'Väike messingvõti.' : 'A small brass key.', media: 0 }] },
    { name: et ? 'Võta' : 'Take', acts: [{ t: 'give', item: it.id }, { t: 'task', task: task.id, state: 'done' },
      { t: 'msg', text: et ? 'Võti on nüüd sinu varustuses. Seiklus läbi!' : 'The key is now in your inventory. Adventure complete!', media: 0 }, { t: 'finish' }] }];
  q.answers = [{ match: '4|neli|four', acts: [{ t: 'msg', text: et ? 'Õige!' : 'Correct!', media: 0 }] }];
  q.else = [{ t: 'msg', text: et ? 'Vale vastus, proovi uuesti.' : 'Wrong answer, try again.', media: 0 }, { t: 'ask', q: q.id }];
  z.enter = [{ t: 'msg', text: et ? 'Tere tulemast! Vaata ümber ja võta võti.' : 'Welcome! Look around and take the key.', media: 0 }, { t: 'ask', q: q.id }];
  v.zones = [z]; v.items = [it]; v.tasks = [task]; v.qs = [q];
  v.start = [];
  V = old; return v;
}

/* ------------------------------------------------------------------ Lua generation */
const lstr = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '').replace(/\n/g, '\\n') + '"';
const vname = s => 'v_' + (String(s).trim().replace(/[^A-Za-z0-9_]/g, '_') || 'x');
const num = s => { const n = parseFloat(String(s).replace(',', '.')); return isFinite(n) ? n : null; };
const lval = s => { const n = num(s); return n !== null && String(s).trim() !== '' ? String(n) : lstr(s); };
const kvar = (kind, id) => kind + id;

function condLua(c) {
  const R = (kind) => { const o = find(kind, c.ref); return o ? kvar(kind, o.id) : null; };
  switch (c.k) {
    case 'has': { const r = R('i'); return r ? `${r}.Container == Wherigo.Player` : 'false'; }
    case 'nothas': { const r = R('i'); return r ? `${r}.Container ~= Wherigo.Player` : 'true'; }
    case 'taskdone': { const r = R('k'); return r ? `(${r}.Complete == true and ${r}.CorrectState ~= "NotCorrect")` : 'false'; }
    case 'tasknot': { const r = R('k'); return r ? `not (${r}.Complete == true and ${r}.CorrectState ~= "NotCorrect")` : 'true'; }
    case 'eq': return `tostring(${vname(c.name)}) == tostring(${lval(c.val)})`;
    case 'gt': return `(tonumber(${vname(c.name)}) or 0) > ${num(c.val) ?? 0}`;
    case 'lt': return `(tonumber(${vname(c.name)}) or 0) < ${num(c.val) ?? 0}`;
  }
  return 'false';
}
const mediaVar = i => (i > 0 && i <= host.B.media.length) ? 'md' + i : null;

function genActs(list, ind, out) {
  const pad = '  '.repeat(ind);
  let n = 0;
  for (const a of list) {
    const I = (kind, id) => { const o = find(kind, id); return o ? kvar(kind, o.id) : null; };
    switch (a.t) {
      case 'msg': { const mv = mediaVar(a.media); out.push(`${pad}Wherigo.MessageBox{ Text = ${lstr(a.text)}${mv ? ', Media = ' + mv : ''} }`); n++; break; }
      case 'ask': { const q = I('q', a.q); if (q) { out.push(`${pad}Wherigo.GetInput(${q})`); n++; } break; }
      case 'give': { const i = I('i', a.item); if (i) { out.push(`${pad}${i}:MoveTo(Wherigo.Player)`); n++; } break; }
      case 'remove': { const i = I('i', a.item); if (i) { out.push(`${pad}${i}:MoveTo(nil)`); n++; } break; }
      case 'place': { const i = I('i', a.item), z = I('z', a.zone); if (i && z) { out.push(`${pad}${i}:MoveTo(${z})`); n++; } break; }
      case 'vis': case 'act': {
        const [k, id] = [a.ref[0], a.ref.slice(1)], o = a.ref && find(k, id);
        if (o) { out.push(`${pad}${kvar(k, o.id)}.${a.t === 'vis' ? 'Visible' : 'Active'} = ${a.on ? 'true' : 'false'}`); n++; } break; }
      case 'task': { const k = I('k', a.task); if (k) { out.push(`${pad}${k}.Complete = true`, `${pad}${k}.CorrectState = ${a.state === 'failed' ? '"NotCorrect"' : '"Correct"'}`); n++; } break; }
      case 'timer': { const m = I('m', a.timer); if (m) { out.push(`${pad}${m}:${a.op === 'stop' ? 'Stop' : 'Start'}()`); n++; } break; }
      case 'sound': { const mv = mediaVar(a.media); if (mv) { out.push(`${pad}Wherigo.PlayAudio(${mv})`); n++; } break; }
      case 'finish': out.push(`${pad}cartridge.Complete = true`); n++; break;
      case 'set': { if (!String(a.name).trim()) break; const v = vname(a.name);
        out.push(a.op === 'add' ? `${pad}${v} = (tonumber(${v}) or 0) + ${num(a.val) ?? 0}` : `${pad}${v} = ${lval(a.val)}`); n++; break; }
      case 'if': {
        out.push(`${pad}if ${condLua(a.cond)} then`);
        if (!genActs(a.then, ind + 1, out)) out.push(`${pad}  -- (nothing)`);
        if (a.else && a.else.length) { out.push(`${pad}else`); genActs(a.else, ind + 1, out); }
        out.push(`${pad}end`); n++; break; }
    }
  }
  return n;
}
function handler(head, list, out) {
  out.push(`function ${head}`);
  if (!genActs(list, 1, out)) out.push('  -- (nothing)');
  out.push('end', '');
}
function collectVars(list, set) {
  for (const a of list || []) { if (a.t === 'set' && String(a.name).trim()) set.add(vname(a.name));
    if (a.t === 'if') { if (['eq', 'gt', 'lt'].includes(a.cond.k) && String(a.cond.name).trim()) set.add(vname(a.cond.name)); collectVars(a.then, set); collectVars(a.else, set); } }
}
function allLists() {
  const L = [V.start];
  V.zones.forEach(z => L.push(z.enter, z.exit)); [...V.items, ...V.chars].forEach(o => o.cmds.forEach(c => L.push(c.acts)));
  V.timers.forEach(m => L.push(m.acts)); V.qs.forEach(q => { q.answers.forEach(a => L.push(a.acts)); L.push(q.else); q.choices.forEach(c => L.push(c.acts)); });
  return L;
}

function genLua(vis, B) {
  const saved = V; V = vis; const out = [];
  try {
    out.push('require "Wherigo"', '', 'cartridge = Wherigo.ZCartridge()');
    if (B.meta.name) out.push(`cartridge.Name = ${lstr(B.meta.name)}`);
    if (B.meta.desc) out.push(`cartridge.Description = ${lstr(B.meta.desc)}`);
    out.push('');
    B.media.forEach((m, i) => out.push(`md${i + 1} = Wherigo.ZMedia(cartridge)`, `md${i + 1}.Name = ${lstr(m.name)}`,
      `md${i + 1}.Resources = { { Type = "${host.typeName(m.type)}", Filename = ${lstr(m.name)}, Directives = {} } }`));
    if (B.media.length) out.push('');
    const vars = new Set(); allLists().forEach(l => collectVars(l, vars)); [...vars].forEach(v => out.push(`${v} = 0`)); if (vars.size) out.push('');
    for (const z of V.zones) {
      const la = num(z.lat) ?? 0, lo = num(z.lon) ?? 0, r = Math.max(5, num(z.r) ?? 30), N = 12, pts = [];
      const dla = r / 111320, dlo = r / (111320 * Math.max(0.1, Math.cos(la * Math.PI / 180)));
      for (let k = 0; k < N; k++) { const a = 2 * Math.PI * k / N; pts.push(`  Wherigo.ZonePoint(${(la + dla * Math.sin(a)).toFixed(6)}, ${(lo + dlo * Math.cos(a)).toFixed(6)}, 0)`); }
      out.push(`z${z.id} = Wherigo.Zone(cartridge)`, `z${z.id}.Name = ${lstr(z.name)}`, `z${z.id}.Description = ${lstr(z.desc)}`,
        `z${z.id}.Visible = ${!!z.visible}`, `z${z.id}.Active = ${!!z.active}`, `z${z.id}.ShowObjects = "OnEnter"`, `z${z.id}.Points = {`, pts.join(',\n'), '}', '');
    }
    const where = w => { if (w === 'player') return 'Wherigo.Player'; if (w && w[0] === 'z') { const z = find('z', w.slice(1)); return z ? 'z' + z.id : 'nil'; } return 'nil'; };
    for (const [kind, list, cls] of [['i', V.items, 'ZItem'], ['c', V.chars, 'ZCharacter']]) for (const o of list) {
      const v = kind + o.id;
      out.push(`${v} = Wherigo.${cls}(cartridge)`, `${v}.Name = ${lstr(o.name)}`, `${v}.Description = ${lstr(o.desc)}`, `${v}.Visible = ${!!o.visible}`, `${v}.Container = ${where(o.where)}`);
      out.push(`${v}.Commands = {`, o.cmds.map((c, k) => `  C${k + 1} = Wherigo.ZCommand{ Text = ${lstr(c.name)}, CmdWith = false, Enabled = true }`).join(',\n'), '}', '');
    }
    for (const k of V.tasks) out.push(`k${k.id} = Wherigo.ZTask(cartridge)`, `k${k.id}.Name = ${lstr(k.name)}`, `k${k.id}.Description = ${lstr(k.desc)}`, `k${k.id}.Visible = ${!!k.visible}`, `k${k.id}.Active = ${!!k.active}`, '');
    for (const m of V.timers) out.push(`m${m.id} = Wherigo.ZTimer(cartridge)`, `m${m.id}.Name = ${lstr(m.name)}`, `m${m.id}.Type = "Countdown"`, `m${m.id}.Duration = ${Math.max(1, num(m.secs) ?? 60)}`, '');
    for (const q of V.qs) {
      const mv = mediaVar(q.media);
      out.push(`q${q.id} = Wherigo.ZInput(cartridge)`, `q${q.id}.Name = ${lstr(q.name)}`, `q${q.id}.Text = ${lstr(q.text)}`,
        `q${q.id}.InputType = ${q.type === 'choice' ? '"MultipleChoice"' : '"Text"'}`);
      if (q.type === 'choice') out.push(`q${q.id}.Choices = { ${q.choices.map(c => lstr(c.text)).join(', ')} }`);
      if (mv) out.push(`q${q.id}.Media = ${mv}`);
      out.push('');
    }
    // handlers
    handler('cartridge:OnStart()', V.start, out);
    for (const z of V.zones) { if (z.enter.length) handler(`z${z.id}:OnEnter()`, z.enter, out); if (z.exit.length) handler(`z${z.id}:OnExit()`, z.exit, out); }
    for (const [kind, list] of [['i', V.items], ['c', V.chars]]) for (const o of list) o.cmds.forEach((c, k) => handler(`${kind}${o.id}:OnC${k + 1}()`, c.acts, out));
    for (const m of V.timers) handler(`m${m.id}:OnElapsed()`, m.acts, out);
    for (const q of V.qs) {
      out.push(`function q${q.id}:OnGetInput(input)`);
      const branches = q.type === 'choice'
        ? q.choices.map(c => ({ cond: `input == ${lstr(c.text)}`, acts: c.acts }))
        : q.answers.map(a => ({ cond: String(a.match).split('|').map(s => s.trim()).filter(Boolean).map(s => `Wherigo.NoCaseEquals(input, ${lstr(s)})`).join(' or ') || 'false', acts: a.acts }));
      branches.forEach((b, k) => { out.push(`  ${k ? 'elseif' : 'if'} ${b.cond} then`); if (!genActs(b.acts, 2, out)) out.push('    -- (nothing)'); });
      if (q.type !== 'choice' && q.else.length) { if (branches.length) out.push('  else'); else out.push('  do'); genActs(q.else, 2, out); out.push('  end'); }
      else if (branches.length) out.push('  end');
      out.push('end', '');
    }
    out.push('return cartridge', '');
  } finally { V = saved; }
  return out.join('\n');
}

/* ------------------------------------------------------------------ plain-language summary */
const nameOf = (kind, id) => { const o = find(kind, id); return o ? o.name : '?'; };
function actText(a) {
  const x = (kind, id) => nameOf(kind, id);
  switch (a.t) {
    case 'msg': return t('t.msg', { x: a.text });
    case 'ask': return t('t.ask', { x: x('q', a.q) });
    case 'give': return t('t.give', { x: x('i', a.item) });
    case 'remove': return t('t.remove', { x: x('i', a.item) });
    case 'place': return t('t.place', { x: x('i', a.item), y: x('z', a.zone) });
    case 'vis': return t('t.vis', { x: a.ref ? nameOf(a.ref[0], a.ref.slice(1)) : '?', y: a.on ? t('a.show') : t('a.hide') });
    case 'act': return t('t.act', { x: a.ref ? nameOf(a.ref[0], a.ref.slice(1)) : '?', y: a.on ? t('a.on') : t('a.off') });
    case 'task': return t('t.task', { x: x('k', a.task), y: a.state === 'failed' ? t('a.failed') : t('a.done') });
    case 'timer': return t('t.timer', { x: x('m', a.timer), y: a.op === 'stop' ? t('a.stop') : t('a.start') });
    case 'sound': return t('t.sound', { x: a.media });
    case 'finish': return t('t.finish');
    case 'set': return t('t.set', { x: a.name, y: (a.op === 'add' ? t('a.addTo') : t('a.setTo')) + ' ' + a.val });
    case 'if': { const c = a.cond; const o = ['has', 'nothas'].includes(c.k) ? nameOf('i', c.ref) : ['taskdone', 'tasknot'].includes(c.k) ? nameOf('k', c.ref) : c.name + ' ' + c.val;
      return t('t.if', { x: t('c.' + c.k) + ' ' + o, y: a.then.map(actText).join('; ') }) + (a.else && a.else.length ? t('t.else', { y: a.else.map(actText).join('; ') }) : ''); }
  }
  return '';
}
function summaryHTML() {
  const rows = [];
  const add = (head, list) => rows.push(`<li><b>${esc(head)}</b>: ${list.length ? '<ol>' + list.map(a => `<li>${esc(actText(a))}</li>`).join('') + '</ol>' : esc(t('s.noacts'))}</li>`);
  add(t('s.start'), V.start);
  V.zones.forEach(z => { add(t('s.enter', { n: z.name }), z.enter); if (z.exit.length) add(t('s.exit', { n: z.name }), z.exit); });
  [...V.items, ...V.chars].forEach(o => o.cmds.forEach(c => add(t('s.cmd', { c: c.name, n: o.name }), c.acts)));
  V.timers.forEach(m => add(t('s.elapsed', { n: m.name }), m.acts));
  V.qs.forEach(q => { if (q.type === 'choice') q.choices.forEach(c => add(t('s.choice', { n: q.name, m: c.text }), c.acts));
    else { q.answers.forEach(a => add(t('s.ans', { n: q.name, m: a.match }), a.acts)); add(t('s.else', { n: q.name }), q.else); } });
  return '<ul class="vsum">' + rows.join('') + '</ul>';
}

/* ------------------------------------------------------------------ resolving action lists */
function rootList(r) {
  if (r === 'start') return V.start;
  const [kind, id, what, n] = r.split(':'), o = find(kind, id); if (!o) return [];
  switch (what) {
    case 'enter': return o.enter; case 'exit': return o.exit; case 'cmd': return o.cmds[+n].acts;
    case 'ans': return o.answers[+n].acts; case 'else': return o.else; case 'ch': return o.choices[+n].acts; case 'el': return o.acts;
  }
  return [];
}
function resolve(key) {
  const parts = key.split('#'); let list = rootList(parts[0]);
  for (let k = 1; k < parts.length; k++) { const [idx, br] = parts[k].split('.'); const a = list[+idx]; list = br === 'then' ? a.then : a.else; }
  return list;
}

/* ------------------------------------------------------------------ rendering */
const A = s => esc(String(s));
function selHTML(opts, val, attrs) { return `<select ${attrs}>${opts.map(([v, l]) => `<option value="${A(v)}"${String(v) === String(val) ? ' selected' : ''}>${A(l)}</option>`).join('')}</select>`; }
const objOpts = (kind) => [[0, t('v.none')]].concat(V[KINDS[kind]].map(o => [o.id, o.name]));
const mediaOpts = () => [[0, t('b.none')]].concat(host.B.media.map((m, i) => [i + 1, (i + 1) + '. ' + m.name]));
const anyObjOpts = () => [['', t('v.none')]].concat(['z', 'i', 'c', 'k'].flatMap(k => V[KINDS[k]].map(o => [k + o.id, ({ z: '📍', i: '🎒', c: '🧑', k: '☑' })[k] + ' ' + o.name])));

function condHTML(c, key, i) {
  const at = f => `class="af" data-list="${A(key)}" data-i="${i}" data-f="cond.${f}"`;
  let h = selHTML(COND_KINDS.map(k => [k, t('c.' + k)]), c.k, `${at('k')} data-r="1"`) + ' ';
  if (c.k === 'has' || c.k === 'nothas') h += selHTML(objOpts('i'), c.ref, at('ref'));
  else if (c.k === 'taskdone' || c.k === 'tasknot') h += selHTML(objOpts('k'), c.ref, at('ref'));
  else h += `<input type="text" ${at('name')} value="${A(c.name)}" placeholder="${A(t('a.varName'))}" style="width:9em"> <input type="text" ${at('val')} value="${A(c.val)}" placeholder="${A(t('a.value'))}" style="width:6em">`;
  return h;
}

function actHTML(a, key, i, n) {
  const at = f => `class="af" data-list="${A(key)}" data-i="${i}" data-f="${f}"`;
  const typeSel = selHTML(ACT_TYPES.map(k => [k, t('a.' + k)]), a.t, `class="atype" data-list="${A(key)}" data-i="${i}"`);
  let body = '';
  switch (a.t) {
    case 'msg': body = `<textarea ${at('text')} rows="2" placeholder="${A(t('a.text'))}">${A(a.text)}</textarea><br>${selHTML(mediaOpts(), a.media, at('media'))}`; break;
    case 'ask': body = selHTML(objOpts('q'), a.q, at('q')); break;
    case 'give': case 'remove': body = selHTML(objOpts('i'), a.item, at('item')); break;
    case 'place': body = selHTML(objOpts('i'), a.item, at('item')) + ' → ' + selHTML(objOpts('z'), a.zone, at('zone')); break;
    case 'vis': body = selHTML(anyObjOpts(), a.ref, at('ref')) + ' ' + selHTML([[1, t('a.show')], [0, t('a.hide')]], a.on ? 1 : 0, at('on')); break;
    case 'act': body = selHTML(anyObjOpts(), a.ref, at('ref')) + ' ' + selHTML([[1, t('a.on')], [0, t('a.off')]], a.on ? 1 : 0, at('on')); break;
    case 'task': body = selHTML(objOpts('k'), a.task, at('task')) + ' ' + selHTML([['done', t('a.done')], ['failed', t('a.failed')]], a.state, at('state')); break;
    case 'timer': body = selHTML(objOpts('m'), a.timer, at('timer')) + ' ' + selHTML([['start', t('a.start')], ['stop', t('a.stop')]], a.op, at('op')); break;
    case 'sound': body = selHTML(mediaOpts(), a.media, at('media')); break;
    case 'finish': body = ''; break;
    case 'set': body = `<input type="text" ${at('name')} value="${A(a.name)}" placeholder="${A(t('a.varName'))}" style="width:9em"> ${selHTML([['set', t('a.setTo')], ['add', t('a.addTo')]], a.op, at('op'))} <input type="text" ${at('val')} value="${A(a.val)}" placeholder="${A(t('a.value'))}" style="width:6em">`; break;
    case 'if': body = `<div>${condHTML(a.cond, key, i)}</div><div class="nest"><div class="nl">${t('a.then')}</div>${listHTML(key + '#' + i + '.then', a.then)}`
      + (a.else ? `<div class="nl">${t('a.else')}</div>${listHTML(key + '#' + i + '.else', a.else)}` : `<button class="btn sm ghost" data-addelse="${A(key)}" data-i="${i}">${t('a.addElse')}</button>`) + '</div>'; break;
  }
  return `<div class="act"><div class="an">${i + 1}</div><div class="ab">${typeSel}${body ? '<div class="af-row">' + body + '</div>' : ''}</div>
    <div class="ac"><button data-mv="-1" data-list="${A(key)}" data-i="${i}" aria-label="up">↑</button><button data-mv="1" data-list="${A(key)}" data-i="${i}" aria-label="down">↓</button><button data-rm="1" data-list="${A(key)}" data-i="${i}" aria-label="remove">✕</button></div></div>`;
}
function listHTML(key, list) {
  return `<div class="alist">${list.length ? list.map((a, i) => actHTML(a, key, i)).join('') : `<p class="muted small" style="margin:4px 0">${t('v.noActs')}</p>`}
    <select class="addact" data-list="${A(key)}"><option value="">${t('v.addAct')}</option>${ACT_TYPES.map(k => `<option value="${k}">${A(t('a.' + k))}</option>`).join('')}</select></div>`;
}
const of = (kind, o, f, extra) => `class="of" data-kind="${kind}" data-id="${o.id}" data-f="${f}" ${extra || ''}`;
function whereOpts(o, allowPlayer) {
  const opts = [['none', t('v.whereNone')]]; if (allowPlayer) opts.push(['player', t('v.wherePlayer')]);
  V.zones.forEach(z => opts.push(['z' + z.id, t('v.whereZone', { n: z.name })])); return opts;
}
function cmdsHTML(kind, o) {
  return `<h4>${t('v.cmds')}</h4>` + o.cmds.map((c, k) => `<div class="cmd"><div class="row" style="margin:4px 0"><input type="text" class="cf" data-kind="${kind}" data-id="${o.id}" data-k="${k}" value="${A(c.name)}" placeholder="${A(t('v.cmdName'))}" style="flex:1">
    <button class="btn sm ghost" data-rmcmd="${kind}:${o.id}:${k}">✕</button></div><div class="when">${A(t('v.cmdWhen', { n: c.name }))}</div>${listHTML(`${kind}:${o.id}:cmd:${k}`, c.acts)}</div>`).join('')
    + `<button class="btn sm ghost" data-addcmd="${kind}:${o.id}">${t('v.addCmd')}</button>`;
}
function objHTML(kind, o) {
  const icon = { z: '📍', i: '🎒', c: '🧑', k: '☑', m: '⏱', q: '❓' }[kind];
  let sub = '', body = `<label>${t('v.name')}</label><input type="text" ${of(kind, o, 'name')} value="${A(o.name)}">`;
  if (kind !== 'm' && kind !== 'q') body += `<label>${t('v.desc')}</label><textarea ${of(kind, o, 'desc', 'rows="2"')}>${A(o.desc)}</textarea>`;
  if (kind === 'z') {
    body += `<div class="two"><div><label>${t('v.lat')}</label><input type="text" inputmode="decimal" ${of(kind, o, 'lat')} value="${A(o.lat)}"></div><div><label>${t('v.lon')}</label><input type="text" inputmode="decimal" ${of(kind, o, 'lon')} value="${A(o.lon)}"></div></div>
      <label>${t('v.radius')}</label><input type="number" min="5" ${of(kind, o, 'r')} value="${A(o.r)}">
      <div class="row"><button class="btn sm ghost" data-pick="${o.id}">${t('v.pick')}</button><button class="btn sm ghost" data-here="${o.id}">${t('v.here')}</button></div>
      <label class="chk"><input type="checkbox" ${of(kind, o, 'visible')} ${o.visible ? 'checked' : ''}> ${t('v.visible')}</label><label class="chk"><input type="checkbox" ${of(kind, o, 'active')} ${o.active ? 'checked' : ''}> ${t('v.active')}</label>
      <div class="when">${t('v.onEnter')}</div>${listHTML(`z:${o.id}:enter`, o.enter)}<div class="when">${t('v.onExit')}</div>${listHTML(`z:${o.id}:exit`, o.exit)}`;
    sub = o.enter.length + o.exit.length ? '' : '';
  } else if (kind === 'i' || kind === 'c') {
    body += `<label>${t('v.where')}</label>${selHTML(whereOpts(o, kind === 'i'), o.where, of(kind, o, 'where'))}
      <label class="chk"><input type="checkbox" ${of(kind, o, 'visible')} ${o.visible ? 'checked' : ''}> ${t('v.visible')}</label>` + cmdsHTML(kind, o);
  } else if (kind === 'k') {
    body += `<label class="chk"><input type="checkbox" ${of(kind, o, 'visible')} ${o.visible ? 'checked' : ''}> ${t('v.visible')}</label><label class="chk"><input type="checkbox" ${of(kind, o, 'active')} ${o.active ? 'checked' : ''}> ${t('v.active')}</label>`;
  } else if (kind === 'm') {
    body += `<label>${t('v.secs')}</label><input type="number" min="1" ${of(kind, o, 'secs')} value="${A(o.secs)}"><div class="when">${t('v.onElapsed')}</div>${listHTML(`m:${o.id}:el`, o.acts)}`;
  } else if (kind === 'q') {
    body += `<label>${t('v.qText')}</label><textarea ${of(kind, o, 'text', 'rows="2"')}>${A(o.text)}</textarea><label>${t('v.qMedia')}</label>${selHTML(mediaOpts(), o.media, of(kind, o, 'media'))}
      <label>${t('v.qType')}</label>${selHTML([['text', t('v.qTypeText')], ['choice', t('v.qTypeChoice')]], o.type, of(kind, o, 'type', 'data-r="1"'))}`;
    if (o.type === 'choice') {
      body += `<h4>${t('v.choices')}</h4>` + o.choices.map((c, k) => `<div class="cmd"><div class="row" style="margin:4px 0"><input type="text" class="chf" data-id="${o.id}" data-k="${k}" value="${A(c.text)}" placeholder="${A(t('v.choiceText'))}" style="flex:1"><button class="btn sm ghost" data-rmch="${o.id}:${k}">✕</button></div>
        <div class="when">${A(t('v.choiceWhen', { m: c.text }))}</div>${listHTML(`q:${o.id}:ch:${k}`, c.acts)}</div>`).join('') + `<button class="btn sm ghost" data-addch="${o.id}">${t('v.addChoice')}</button>`;
    } else {
      body += `<h4>${t('v.answers')}</h4>` + o.answers.map((a, k) => `<div class="cmd"><label>${t('v.ansMatch')}</label><div class="row" style="margin:4px 0"><input type="text" class="amf" data-id="${o.id}" data-k="${k}" value="${A(a.match)}" style="flex:1"><button class="btn sm ghost" data-rmans="${o.id}:${k}">✕</button></div>
        <div class="when">${A(t('v.ansWhen', { m: a.match }))}</div>${listHTML(`q:${o.id}:ans:${k}`, a.acts)}</div>`).join('')
        + `<button class="btn sm ghost" data-addans="${o.id}">${t('v.addAns')}</button><div class="when">${t('v.elseWhen')}</div>${listHTML(`q:${o.id}:else`, o.else)}`;
    }
  }
  body += `<div class="row"><button class="btn sm ghost" data-delobj="${kind}:${o.id}">🗑 ${t('v.del')}</button></div>`;
  return `<details class="oc" data-oid="${kind}${o.id}"${host.open.has(kind + o.id) ? ' open' : ''}><summary>${icon} ${A(o.name)}</summary><div class="ob">${body}</div></details>`;
}

const CSS = `
.vis h3{margin:.9em 0 .3em;font-size:1rem} .vis h4{margin:.9em 0 .2em;font-size:.85rem;color:var(--muted)}
.vis details.oc{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:8px 10px;margin:8px 0} .vis details.oc>summary{font-weight:600}
.vis .ob{padding-top:4px} .vis label.chk{display:block;color:var(--ink);font-size:.9rem;margin:8px 0} .vis label.chk input{width:auto;margin-right:6px}
.vis .when{font-weight:600;font-size:.85rem;margin:12px 0 4px;color:var(--accent)}
.vis .alist{border-left:3px solid var(--line);padding-left:8px;margin:4px 0}
.vis .act{display:flex;gap:6px;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:6px;margin:6px 0}
.vis .an{width:1.4em;color:var(--muted);font-weight:700;text-align:center;padding-top:6px} .vis .ab{flex:1;min-width:0} .vis .ab select,.vis .ab input,.vis .ab textarea{margin:3px 0;font:inherit;max-width:100%;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}
.vis .ab textarea{width:100%} .vis .af-row{margin-top:2px} .vis .ac{display:flex;flex-direction:column;gap:2px} .vis .ac button{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:6px;width:2rem;height:1.8rem;font:inherit}
.vis .nest{border-left:3px solid var(--accent);padding-left:8px;margin-top:6px} .vis .nl{font-size:.8rem;font-weight:600;color:var(--accent);margin-top:4px}
.vis select.addact{width:100%;padding:8px;border:1px dashed var(--accent);border-radius:8px;background:transparent;color:var(--accent);font:inherit;margin-top:4px}
.vis .cmd{border:1px solid var(--line);border-radius:8px;padding:6px 8px;margin:8px 0}
.vis .vsum{padding-left:1.1em;font-size:.9rem} .vis .vsum ol{margin:2px 0 8px;padding-left:1.4em}
.vis .adds{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}
.mapov{position:fixed;inset:0;z-index:50;background:var(--bg);display:flex;flex-direction:column} .mapov .mm{flex:1} .mapov .bar{display:flex;gap:8px;padding:10px;align-items:center;background:var(--surface);border-top:1px solid var(--line)}
`;

/* ------------------------------------------------------------------ interactions */
function touch() { host.onChange(); }
function rerender() { const y = host.box.closest('main') ? host.box.closest('main').scrollTop : 0; paint(); const m = host.box.closest('main'); if (m) m.scrollTop = y; }

function paint() {
  const box = host.box;
  const sec = (title, kind, list, addKey) => `<h3>${title}</h3>${list.length ? list.map(o => objHTML(kind, o)).join('') : `<p class="muted small">${t('v.nothing')}</p>`}<div class="adds"><button class="btn sm ghost" data-add="${kind}">${t(addKey)}</button></div>`;
  box.innerHTML = `<div class="vis">
    <div class="row"><button class="btn sm ghost" id="vSample">${t('sample')}</button></div>
    <h3>${t('v.start')}</h3><p class="muted small" style="margin:0">${t('v.startHint')}</p>${listHTML('start', V.start)}
    ${sec(t('v.zones'), 'z', V.zones, 'v.addZone')}${sec(t('v.items'), 'i', V.items, 'v.addItem')}${sec(t('v.chars'), 'c', V.chars, 'v.addChar')}
    ${sec(t('v.tasks'), 'k', V.tasks, 'v.addTask')}${sec(t('v.timers'), 'm', V.timers, 'v.addTimer')}${sec(t('v.qs'), 'q', V.qs, 'v.addQ')}
    <details style="margin-top:14px"><summary>${t('s.title')}</summary><div id="vSum">${summaryHTML() || t('s.empty')}</div></details></div>`;
  $('#vSample').onclick = () => { if (confirm(t('sample.confirm'))) { V = host.B.vis = sampleVis(); touch(); rerender(); } };
}

function wire(box) {
  box.addEventListener('toggle', e => { const d = e.target; if (d.dataset && d.dataset.oid) { d.open ? host.open.add(d.dataset.oid) : host.open.delete(d.dataset.oid); } }, true);
  box.addEventListener('input', e => {
    const el = e.target;
    if (el.classList.contains('af')) { setField(el); }
    else if (el.classList.contains('of')) { objField(el); }
    else if (el.classList.contains('cf')) { find(el.dataset.kind, el.dataset.id).cmds[+el.dataset.k].name = el.value; touch(); }
    else if (el.classList.contains('amf')) { find('q', el.dataset.id).answers[+el.dataset.k].match = el.value; touch(); }
    else if (el.classList.contains('chf')) { find('q', el.dataset.id).choices[+el.dataset.k].text = el.value; touch(); }
    else return;
    const s = $('#vSum'); if (s) s.innerHTML = summaryHTML();
  });
  box.addEventListener('change', e => {
    const el = e.target;
    if (el.classList.contains('addact')) { if (!el.value) return; resolve(el.dataset.list).push(defAct(el.value)); touch(); rerender(); }
    else if (el.classList.contains('atype')) { const l = resolve(el.dataset.list); l[+el.dataset.i] = defAct(el.value); touch(); rerender(); }
    else if ((el.classList.contains('af') || el.classList.contains('of')) && el.dataset.r) { el.classList.contains('af') ? setField(el) : objField(el); rerender(); }
    else if (el.classList.contains('af') || el.classList.contains('of')) { const s = $('#vSum'); if (s) s.innerHTML = summaryHTML(); }
  });
  box.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (d.add) { const o = newObj(d.add); V[KINDS[d.add]].push(o); host.open.add(d.add + o.id); touch(); rerender(); }
    else if (d.delobj) { const [k, id] = d.delobj.split(':'), o = find(k, id); if (o && confirm(t('v.delConfirm', { n: o.name }))) { V[KINDS[k]] = V[KINDS[k]].filter(x => x.id !== o.id); touch(); rerender(); } }
    else if (d.rm) { resolve(d.list).splice(+d.i, 1); touch(); rerender(); }
    else if (d.mv) { const l = resolve(d.list), i = +d.i, j = i + +d.mv; if (j >= 0 && j < l.length) { [l[i], l[j]] = [l[j], l[i]]; touch(); rerender(); } }
    else if (d.addelse) { resolve(d.addelse)[+d.i].else = []; touch(); rerender(); }
    else if (d.addcmd) { const [k, id] = d.addcmd.split(':'), o = find(k, id); o.cmds.push({ name: [t('v.cmdLook'), t('v.cmdTake')][o.cmds.length] || '', acts: [] }); touch(); rerender(); }
    else if (d.rmcmd) { const [k, id, n] = d.rmcmd.split(':'); find(k, id).cmds.splice(+n, 1); touch(); rerender(); }
    else if (d.addans) { find('q', d.addans).answers.push({ match: '', acts: [] }); touch(); rerender(); }
    else if (d.rmans) { const [id, n] = d.rmans.split(':'); find('q', id).answers.splice(+n, 1); touch(); rerender(); }
    else if (d.addch) { find('q', d.addch).choices.push({ text: '', acts: [] }); touch(); rerender(); }
    else if (d.rmch) { const [id, n] = d.rmch.split(':'); find('q', id).choices.splice(+n, 1); touch(); rerender(); }
    else if (d.here) { const z = find('z', d.here), use = p => { z.lat = p.lat.toFixed(6); z.lon = p.lon.toFixed(6); touch(); rerender(); };
      if (state.pos) return use(state.pos); if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => use({ lat: p.coords.latitude, lon: p.coords.longitude }), () => {}, { enableHighAccuracy: true, timeout: 15000 }); }
    else if (d.pick) pickOnMap(find('z', d.pick));
  });
}
function setField(el) {
  const l = resolve(el.dataset.list), a = l[+el.dataset.i]; const f = el.dataset.f;
  let v = el.type === 'checkbox' ? el.checked : el.value;
  if (['on'].includes(f)) v = v === '1';
  if (['media', 'q', 'item', 'zone', 'task', 'timer'].includes(f)) v = +v;
  if (f.startsWith('cond.')) { const c = a.cond, k = f.slice(5); c[k] = (k === 'ref') ? +v : v; if (k === 'k') { c.ref = 0; } return touch(); }
  a[f] = v; touch();
}
function objField(el) {
  const o = find(el.dataset.kind, el.dataset.id), f = el.dataset.f;
  let v = el.type === 'checkbox' ? el.checked : el.value; if (f === 'media') v = +v;
  o[f] = v; touch();
  if (f === 'name') { const s = el.closest('details').querySelector('summary'); s.textContent = s.textContent.split(' ')[0] + ' ' + v; }
}

function pickOnMap(z) {
  const ov = document.createElement('div'); ov.className = 'mapov';
  ov.innerHTML = `<div class="mm" id="pmap"></div><div class="bar"><span class="muted small" style="flex:1">${t('v.mapHint')}</span><button class="btn ghost sm" id="pCancel">${t('btn.cancel')}</button><button class="btn sm" id="pOk">${t('v.mapOk')}</button></div>`;
  document.body.appendChild(ov);
  const la = parseFloat(z.lat) || 59.437, lo = parseFloat(z.lon) || 24.7536; let pos = [la, lo];
  const m = L.map('pmap').setView(pos, 17);
  if (CFG.tileUrl) L.tileLayer(CFG.tileUrl, { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
  const r = Math.max(5, parseFloat(z.r) || 30);
  const mk = L.marker(pos).addTo(m), ci = L.circle(pos, { radius: r, color: '#4fb284' }).addTo(m);
  m.on('click', e => { pos = [e.latlng.lat, e.latlng.lng]; mk.setLatLng(pos); ci.setLatLng(pos); });
  const close = () => { m.remove(); ov.remove(); };
  $('#pCancel').onclick = close;
  $('#pOk').onclick = () => { z.lat = pos[0].toFixed(6); z.lon = pos[1].toFixed(6); close(); touch(); rerender(); };
  setTimeout(() => m.invalidateSize(), 100);
}

let styled = false;
window.WMGVisual = {
  genLua, newV, sampleVis,
  mount(box, h) {
    host = h; host.open = host.open || new Set(); host.box = box; V = h.B.vis;
    if (!styled) { const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); styled = true; }
    if (!box._wired) { wire(box); box._wired = true; }
    paint();
  },
  setHost(h) { host = h; V = h.B.vis; },
  repaint() { if (host && host.box && host.box.isConnected) { V = host.B.vis; paint(); } }
};
})();
