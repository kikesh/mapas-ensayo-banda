import React, { useMemo, useState, useEffect } from 'react';

const defaultLayers = {
  voz: 'media',
  armonia: 'media',
  bajo: 'media',
  bateria: 'media',
  full: 'media',
};

const layerLabels = [
  ['voz', 'Voz', 'V'],
  ['armonia', 'Armonía', 'G'],
  ['bajo', 'Bajo', 'B'],
  ['bateria', 'Batería', 'D'],
  ['full', 'Full band', 'F'],
];

const colorMap = {
  intro: { name: 'Intro', bg: 'bg-blue-900/70', lightBg: 'bg-blue-50', border: 'border-blue-400', chip: 'bg-blue-500' },
  verse: { name: 'Estrofa', bg: 'bg-emerald-900/70', lightBg: 'bg-emerald-50', border: 'border-emerald-400', chip: 'bg-emerald-500' },
  pre: { name: 'Pre', bg: 'bg-yellow-900/70', lightBg: 'bg-yellow-50', border: 'border-yellow-400', chip: 'bg-yellow-500' },
  chorus: { name: 'Estribillo', bg: 'bg-orange-900/70', lightBg: 'bg-orange-50', border: 'border-orange-400', chip: 'bg-orange-500' },
  solo: { name: 'Solo / puente', bg: 'bg-purple-900/70', lightBg: 'bg-purple-50', border: 'border-purple-400', chip: 'bg-purple-500' },
  final: { name: 'Final', bg: 'bg-red-900/70', lightBg: 'bg-red-50', border: 'border-red-400', chip: 'bg-red-500' },
  outro: { name: 'Cierre', bg: 'bg-rose-900/70', lightBg: 'bg-rose-50', border: 'border-rose-400', chip: 'bg-rose-500' },
};

const sharpNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const noteIndex = {
  C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, 'E#': 5, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11,
};

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cls(...parts) {
  return parts.filter(Boolean).join(' ');
}

function getColor(key) {
  return colorMap[key] || colorMap.verse;
}

function Icon({ name, className = '' }) {
  const icons = {
    music: '♪',
    file: '□',
    printer: 'P',
    download: '↓',
    upload: '↑',
    wand: '*',
    clipboard: 'C',
    pencil: 'E',
    eye: 'O',
    plus: '+',
    trash: '×',
    sun: 'S',
    moon: 'M',
  };
  return <span className={cls('inline-flex items-center justify-center font-black', className)}>{icons[name] || name || '•'}</span>;
}

function emptySection() {
  return {
    id: makeId(),
    name: 'Nueva sección',
    bars: 8,
    chords: 'C | F | Am | G',
    color: 'verse',
    lead: 'Voz principal',
    cue: '',
    notes: 'Mantener pulso y preparar siguiente entrada.',
    layers: { ...defaultLayers },
  };
}

function section(name, bars, chords, color, lead, notes, layers = {}, cue = '') {
  return { id: makeId(), name, bars, chords, color, lead, notes, cue, layers: { ...defaultLayers, ...layers } };
}

const blankPreset = {
  title: 'Título de la canción',
  artist: 'Artista',
  subtitle: 'Mapa de ensayo · estructura por compases',
  tempo: '120 BPM',
  meter: '4/4',
  key: 'C mayor',
  practicalKey: 'C · F · Am · G',
  duration: '3:30 aprox.',
  source: 'Título / enlace / audio',
  lyrics: '',
  sections: [emptySection()],
  rehearsalNotes: [
    'Definir quién da la señal de entrada.',
    'Marcar bien los cambios de sección.',
    'Acordar final: corte seco, repetición o fade simulado.',
  ],
  decisions: [
    '¿Tonalidad original o transportada?',
    '¿Solo respetado o libre?',
    '¿Cuántas vueltas de coda?',
    '¿Quién manda las señales?',
  ],
};

const fitoPreset = {
  title: 'ANTES DE QUE CUENTE DIEZ',
  artist: 'Fito & Fitipaldis',
  subtitle: 'Mapa de ensayo · versión práctica para banda',
  tempo: '151 BPM',
  meter: '4/4',
  key: 'F#m original aprox.',
  practicalKey: 'Em · D · Am · C · G',
  duration: '4:45 aprox.',
  source: 'Título reconocido / versión de estudio',
  lyrics: 'Un, dos, tres, va!\n\nNo quiero ver el sol, no quiero amanecer...\n(Pega aquí el resto de la letra completa de tu canción)',
  sections: [
    section('Intro', 4, 'Em | D | Am | C', 'intro', 'Guitarra / batería', 'Preparar entrada de voz. Dinámica contenida.', { voz: 'baja', bajo: 'baja', bateria: 'baja', full: 'baja' }, 'Un, dos, tres, va!'),
    section('Estrofa A', 8, 'Em | D | Am | C | Em | D | Am | C', 'verse', 'Voz principal', 'No sobrecargar. Dejar respirar la letra.', { voz: 'alta' }, 'No quiero ver el sol...'),
    section('Pre', 8, 'Em | G | D | C | Em | G | D | C', 'pre', 'Voz + batería', 'Subir intención sin adelantar el estribillo.', { voz: 'alta', bateria: 'alta' }, 'Y no me importa si...'),
    section('Estribillo', 8, 'G | D | Em | C | G | D | Em | C', 'chorus', 'Toda la banda', 'Abrir dinámica. Coros si los hay, aquí.', { voz: 'alta', armonia: 'alta', bajo: 'alta', bateria: 'alta', full: 'alta' }, 'Antes de que cuente diez...'),
    section('Solo / puente', 8, 'Em | D | C | G | Em | D | C | G', 'solo', 'Guitarra solista', 'La banda sostiene. No tapar el solo.', { voz: 'baja', bajo: 'alta', bateria: 'alta', full: 'alta' }, '(Solo principal)'),
    section('Estribillo final', 16, 'G | D | Em | C · repetir', 'final', 'Voz + banda completa', 'Clímax. Acordar número de vueltas.', { voz: 'alta', armonia: 'alta', bajo: 'alta', bateria: 'alta', full: 'alta' }, 'Antes de que cuente diez... (x2)'),
    section('Cierre', 4, 'Em | D | C | Em', 'outro', 'Batería / director', 'Corte seco o acorde sostenido.', { voz: 'baja', bateria: 'alta' }, ''),
  ],
  rehearsalNotes: [
    'Mantener pulso estable: el tema puede tender a acelerarse.',
    'Las estrofas deben respirar; no llenar demasiado.',
    'El estribillo abre la dinámica de toda la banda.',
    'El solo debe sostenerse con base sólida, sin taparlo.',
  ],
  decisions: [
    '¿Original en F#m o versión práctica transportada?',
    '¿Coros en todos los estribillos o solo en el final?',
    '¿Solo igual que original o adaptado?',
    '¿Cierre seco o sostenido?',
  ],
};

function cloneSong(song) {
  return {
    ...song,
    sections: (song.sections || []).map((s) => ({ ...s, id: makeId(), layers: { ...defaultLayers, ...(s.layers || {}) } })),
    rehearsalNotes: [...(song.rehearsalNotes || [])],
    decisions: [...(song.decisions || [])],
  };
}

function splitPalette(text) {
  return String(text || '')
    .split(/[·,|]/)
    .map((chord) => chord.trim())
    .filter(Boolean);
}

function normalizeSteps(steps) {
  const n = Number(steps) || 0;
  return ((n % 12) + 12) % 12;
}

function shouldUseFlats(text) {
  return ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'].some((note) => String(text || '').includes(note));
}

function transposeRoot(root, steps, useFlats) {
  if (!Object.prototype.hasOwnProperty.call(noteIndex, root)) return root;
  const index = (noteIndex[root] + normalizeSteps(steps)) % 12;
  return useFlats ? flatNotes[index] : sharpNotes[index];
}

function transposeChordToken(token, steps, useFlats) {
  const raw = String(token || '');
  if (!raw || !'ABCDEFG'.includes(raw[0])) return token;
  let root = raw[0];
  let restStart = 1;
  if (raw[1] === '#' || raw[1] === 'b') {
    root = raw.slice(0, 2);
    restStart = 2;
  }
  if (!Object.prototype.hasOwnProperty.call(noteIndex, root)) return token;

  const rest = raw.slice(restStart);
  const slash = rest.indexOf('/');
  if (slash === -1) return transposeRoot(root, steps, useFlats) + rest;

  const suffix = rest.slice(0, slash);
  const bassRaw = rest.slice(slash + 1);
  let bass = bassRaw[0] || '';
  let bassRestStart = 1;
  if (bassRaw[1] === '#' || bassRaw[1] === 'b') {
    bass = bassRaw.slice(0, 2);
    bassRestStart = 2;
  }
  if (!Object.prototype.hasOwnProperty.call(noteIndex, bass)) return transposeRoot(root, steps, useFlats) + rest;
  return transposeRoot(root, steps, useFlats) + suffix + '/' + transposeRoot(bass, steps, useFlats) + bassRaw.slice(bassRestStart);
}

function transposeChordText(text, steps) {
  const original = String(text || '');
  const useFlats = shouldUseFlats(original);
  const separators = ' |,·-\n\t';
  let out = '';
  let token = '';

  const flush = () => {
    if (token) out += transposeChordToken(token, steps, useFlats);
    token = '';
  };

  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    if (separators.includes(ch)) {
      flush();
      out += ch;
    } else {
      token += ch;
    }
  }
  flush();
  return out;
}

function transposeKeyText(text, steps) {
  const source = String(text || '');
  const roots = ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
  for (const root of roots) {
    const pos = source.indexOf(root);
    if (pos !== -1) return source.slice(0, pos) + transposeRoot(root, steps, shouldUseFlats(source)) + source.slice(pos + root.length);
  }
  return source;
}

function transposeSongData(song, steps) {
  return {
    ...song,
    key: transposeKeyText(song.key, steps),
    practicalKey: transposeChordText(song.practicalKey, steps),
    sections: (song.sections || []).map((s) => ({ ...s, chords: transposeChordText(s.chords, steps) })),
  };
}

function intensityClass(value, theme) {
  if (value === 'alta') return theme === 'dark' ? 'bg-lime-400' : 'bg-lime-500';
  if (value === 'media') return theme === 'dark' ? 'bg-amber-400' : 'bg-amber-500';
  if (value === 'baja') return theme === 'dark' ? 'bg-zinc-400' : 'bg-zinc-300';
  return 'bg-transparent border border-dashed border-zinc-500';
}

function normalizeImportedSong(parsed) {
  const safeSections = Array.isArray(parsed.sections) ? parsed.sections : [];
  return {
    ...cloneSong(blankPreset),
    ...parsed,
    sections: safeSections.map((s) => ({
      ...emptySection(),
      ...s,
      id: makeId(),
      bars: Number(s.bars) || 0,
      color: colorMap[s.color] ? s.color : 'verse',
      layers: { ...defaultLayers, ...(s.layers || {}) },
    })),
    rehearsalNotes: Array.isArray(parsed.rehearsalNotes) ? parsed.rehearsalNotes : [],
    decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
  };
}

function getRanges(sections) {
  let current = 1;
  return sections.map((s) => {
    const bars = Number(s.bars || 0);
    const start = current;
    const end = bars > 0 ? current + bars - 1 : current;
    current = end + 1;
    return { start, end };
  });
}

function makeSkeleton(songRequest) {
  return {
    title: songRequest.title || 'Nueva canción',
    artist: songRequest.artist || 'Artista',
    subtitle: 'Mapa de ensayo · versión práctica para banda',
    tempo: '120 BPM aprox.',
    meter: '4/4',
    key: songRequest.key || 'Tonalidad pendiente',
    practicalKey: 'C · F · Am · G',
    duration: '3:30 aprox.',
    source: songRequest.link || 'Introducción manual',
    sections: [
      section('Intro', 4, 'C | F | Am | G', 'intro', 'Guitarra / banda', 'Preparar entrada.', { voz: 'baja', bajo: 'baja', bateria: 'baja', full: 'baja' }),
      section('Estrofa', 8, 'C | F | Am | G · repetir', 'verse', 'Voz principal', 'Dejar espacio a la voz.', { voz: 'alta' }),
      section('Estribillo', 8, 'F | G | C | Am · repetir', 'chorus', 'Toda la banda', 'Abrir dinámica.', { voz: 'alta', armonia: 'alta', bajo: 'alta', bateria: 'alta', full: 'alta' }),
      section('Final', 4, 'C | G | C', 'outro', 'Batería / director', 'Acordar cierre.', { bateria: 'alta' }),
    ],
    rehearsalNotes: [
      'Revisar acordes y compases sobre la grabación real.',
      'Definir quién da las señales de entrada y salida.',
      'Acordar final antes de repartir la hoja.',
    ],
    decisions: ['¿Tonalidad original o transportada?', '¿Final cerrado o fade simulado?', '¿Solo respetado o adaptado?'],
  };
}

function buildSongRequestPrompt(songRequest) {
  const schema = {
    title: '',
    artist: '',
    subtitle: 'Mapa de ensayo · versión práctica para banda',
    tempo: '',
    meter: '4/4',
    key: '',
    practicalKey: '',
    duration: '',
    source: '',
    lyrics: 'Letra completa de la canción aquí con sus saltos de línea...',
    sections: [{ name: 'Intro', bars: 4, chords: 'C | F | Am | G', color: 'intro', lead: 'quién manda o referencia principal', cue: 'frase clave o primera línea de la letra', notes: 'nota de ensayo', layers: { voz: 'baja', armonia: 'media', bajo: 'media', bateria: 'media', full: 'media' } }],
    rehearsalNotes: [],
    decisions: [],
  };
  return [
    'Genera un JSON compatible con mi app Generador de Mapas de Ensayo para Banda.',
    '',
    'Canción: ' + (songRequest.title || '[título]'),
    'Artista: ' + (songRequest.artist || '[artista]'),
    'Enlace o fuente: ' + (songRequest.link || '[opcional]'),
    'Versión deseada: ' + (songRequest.version || 'versión de estudio / oficial'),
    'Tonalidad deseada: ' + (songRequest.key || 'original o práctica para banda'),
    'Notas para la banda: ' + (songRequest.notes || '[opcional]'),
    '',
    'Devuelve SOLO JSON válido, sin markdown, y sin texto fuera del JSON.',
    'Colores permitidos: intro, verse, pre, chorus, solo, final, outro.',
    'Intensidades permitidas en layers: baja, media, alta.',
    'Haz una estimación útil para ensayo si no hay certeza absoluta.',
    'IMPORTANTE: Incluye la letra completa de la canción en el campo "lyrics", y la primera frase/referencia en el campo "cue" de cada sección.',
    '',
    'Esquema exacto:',
    JSON.stringify(schema, null, 2),
  ].join('\n');
}

function runSelfTests() {
  const testSong = {
    title: 'Test',
    artist: 'Band',
    sections: [
      { name: 'A', bars: '4', chords: 'C', color: 'intro', layers: { voz: 'alta' } },
      { name: 'B', bars: 8, chords: 'G', color: 'chorus', layers: { bateria: 'media' } },
    ],
    rehearsalNotes: ['Nota'],
    decisions: ['Decision'],
  };
  const normalized = normalizeImportedSong(testSong);
  const total = normalized.sections.reduce((sum, s) => sum + Number(s.bars || 0), 0);
  return [
    { name: 'Importación JSON conserva secciones', pass: normalized.sections.length === 2 },
    { name: 'Compases string se normalizan a número', pass: normalized.sections[0].bars === 4 },
    { name: 'Total de compases calculable', pass: total === 12 },
    { name: 'Capas incompletas se completan', pass: normalized.sections[0].layers.bajo === 'media' },
    { name: 'Paleta armónica divide acordes', pass: splitPalette('Em · D, Am | C').length === 4 },
    { name: 'Color inválido se normaliza', pass: normalizeImportedSong({ sections: [{ color: 'otro' }] }).sections[0].color === 'verse' },
    { name: 'Canción sin secciones no rompe', pass: normalizeImportedSong({ title: 'Vacía' }).sections.length === 0 },
    { name: 'Rangos de compases correctos', pass: getRanges([{ bars: 4 }, { bars: 8 }])[1].start === 5 },
    { name: 'Clonado genera nuevos ids', pass: cloneSong(fitoPreset).sections[0].id !== fitoPreset.sections[0].id },
    { name: 'Skeleton JSON es importable', pass: normalizeImportedSong(makeSkeleton({ title: 'X', artist: 'Y', link: '', key: 'C', notes: '' })).title === 'X' },
    { name: 'Prompt contiene esquema JSON', pass: buildSongRequestPrompt({ title: 'A', artist: 'B' }).includes('sections') },
    { name: 'Color helper devuelve fallback', pass: getColor('noexiste').name === 'Estrofa' },
    { name: 'Sección vacía tiene capas por defecto', pass: emptySection().layers.bateria === 'media' },
    { name: 'Transposición +2 de acordes básicos', pass: transposeChordText('Em | D | Am | C', 2) === 'F#m | E | Bm | D' },
    { name: 'Transposición mantiene bajo slash', pass: transposeChordText('C/G', 2) === 'D/A' },
    { name: 'Transposición de canción cambia secciones', pass: transposeSongData({ key: 'C mayor', practicalKey: 'C · F', sections: [{ chords: 'C | F' }] }, 2).sections[0].chords === 'D | G' },
  ];
}

function Field({ label, value, onChange, className = '' }) {
  return (
    <label className={cls('block', className)}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-zinc-300/30 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-amber-400 dark:bg-zinc-900/70 dark:text-zinc-100" />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-xl border border-zinc-300/30 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-amber-400 dark:bg-zinc-900/70 dark:text-zinc-100" />
    </label>
  );
}

function HeaderCard({ icon, label, value, theme }) {
  return (
    <div className={cls('flex items-center gap-3 rounded-2xl border p-3 print:break-inside-avoid', theme === 'dark' ? 'border-amber-400/50 bg-black/30' : 'border-zinc-300 bg-white')}>
      <Icon name={icon} className={cls('h-6 w-6 shrink-0 text-xl', theme === 'dark' ? 'text-amber-300' : 'text-zinc-800')} />
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</div>
        <div className="truncate text-sm font-bold" title={String(value)}>{value}</div>
      </div>
    </div>
  );
}

function InfoBox({ title, items, dark, marker }) {
  return (
    <div className={cls('rounded-2xl border p-4 print:break-inside-avoid', dark ? 'border-amber-400/50 bg-black/25' : 'border-zinc-300 bg-white')}>
      <div className={cls('mb-2 text-lg font-black uppercase tracking-widest', dark ? 'text-amber-200' : 'text-amber-700')}>{title}</div>
      <ul className="space-y-1 text-sm">{(items || []).map((n, i) => <li key={i}>{marker} {n}</li>)}</ul>
    </div>
  );
}

function TransposeBox({ onTranspose }) {
  const [steps, setSteps] = useState(1);
  const apply = (value) => onTranspose(Number(value) || 0);
  return (
    <div className="rounded-3xl border border-amber-300/30 bg-amber-50/80 p-4 shadow-sm dark:bg-zinc-900/80">
      <h2 className="mb-2 text-lg font-black">Transposición</h2>
      <p className="mb-3 text-sm opacity-70">Sube o baja todos los acordes: paleta armónica, tonalidad y acordes por sección.</p>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Semitonos" value={String(steps)} onChange={(v) => setSteps(Number(v) || 0)} className="w-32" />
        <button onClick={() => apply(-2)} className="rounded-xl bg-zinc-700 px-3 py-2 text-sm font-bold text-white">-2</button>
        <button onClick={() => apply(-1)} className="rounded-xl bg-zinc-700 px-3 py-2 text-sm font-bold text-white">-1</button>
        <button onClick={() => apply(steps)} className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-black text-black">Aplicar</button>
        <button onClick={() => apply(1)} className="rounded-xl bg-zinc-700 px-3 py-2 text-sm font-bold text-white">+1</button>
        <button onClick={() => apply(2)} className="rounded-xl bg-zinc-700 px-3 py-2 text-sm font-bold text-white">+2</button>
      </div>
    </div>
  );
}

function RehearsalSheet({ data, theme, showLyrics }) {
  const totalBars = data.sections.reduce((sum, s) => sum + Number(s.bars || 0), 0);
  const ranges = useMemo(() => getRanges(data.sections), [data.sections]);
  const dark = theme === 'dark';
  const pageBg = dark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-950';
  const panel = dark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-300 bg-white';
  const soft = dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200';
  return (
    <div id="sheet" className={cls('mx-auto w-[980px] rounded-[1.5rem] border p-8 shadow-2xl print:w-full print:rounded-none print:shadow-none', pageBg, dark ? 'border-zinc-800' : 'border-zinc-200')}>
      <div className="mb-5 flex items-start justify-between gap-6 border-b border-zinc-300/40 pb-4">
        <div>
          <div className="mb-1 text-xs font-black uppercase tracking-[0.35em] opacity-60">Hoja de ensayo A4</div>
          <h1 className="text-4xl font-black uppercase leading-none tracking-tight">{data.title}</h1>
          <h2 className={cls('mt-1 text-2xl font-extrabold', dark ? 'text-amber-300' : 'text-amber-700')}>{data.artist}</h2>
          <p className="mt-1 text-sm opacity-70">{data.subtitle}</p>
        </div>
        <div className={cls('grid min-w-[310px] grid-cols-2 gap-2 rounded-2xl border p-3 text-sm print:break-inside-avoid', soft)}>
          <div><b>Tempo:</b> {data.tempo}</div>
          <div><b>Compás:</b> {data.meter}</div>
          <div><b>Tono:</b> {data.key}</div>
          <div><b>Duración:</b> {data.duration}</div>
          <div className="col-span-2"><b>Acordes base:</b> {data.practicalKey}</div>
        </div>
      </div>
      <div className={cls('mb-5 rounded-2xl border p-4', panel)}>
        <h3 className="mb-3 text-sm font-black uppercase tracking-[0.25em] opacity-70">Estructura global</h3>
        <div className="flex flex-wrap items-center gap-2">
          {data.sections.map((s, i) => (
            <React.Fragment key={s.id}>
              <span className={cls('rounded-lg px-3 py-2 text-xs font-black uppercase text-white', getColor(s.color).chip)}>{s.name} <span className="font-medium normal-case">x{s.bars}</span></span>
              {i < data.sections.length - 1 ? <span className="font-black opacity-50">-&gt;</span> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={cls('mb-5 overflow-hidden rounded-2xl border', dark ? 'border-zinc-700' : 'border-zinc-300')}>
        <table className="w-full border-collapse text-left text-sm">
          <thead className={dark ? 'bg-zinc-800' : 'bg-zinc-100'}>
            <tr>
              <th className="p-2 text-xs uppercase tracking-widest">#</th>
              <th className="p-2 text-xs uppercase tracking-widest">Sección</th>
              <th className="p-2 text-xs uppercase tracking-widest">Compases</th>
              <th className="p-2 text-xs uppercase tracking-widest">Acordes</th>
              <th className="p-2 text-xs uppercase tracking-widest">Referencia</th>
              <th className="p-2 text-xs uppercase tracking-widest">Nota</th>
            </tr>
          </thead>
          <tbody>
            {data.sections.map((s, i) => {
              const c = getColor(s.color);
              const r = ranges[i] || { start: 0, end: 0 };
              return (
                <tr key={s.id} className={cls('border-t print:break-inside-avoid', dark ? 'border-zinc-800' : 'border-zinc-200')}>
                  <td className="p-2 font-black">{i + 1}</td>
                  <td className="p-2">
                    <span className={cls('mr-2 inline-block h-3 w-3 rounded-full', c.chip)} /> <b>{s.name}</b>
                    {s.cue && <div className="mt-1 text-xs italic opacity-70">"{s.cue}"</div>}
                  </td>
                  <td className="p-2">{s.bars} <span className="opacity-60">({r.start}-{r.end})</span></td>
                  <td className="p-2 font-mono font-black tracking-wide">{s.chords}</td>
                  <td className="p-2 font-semibold">{s.lead}</td>
                  <td className="p-2 opacity-90">{s.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-4">
        <InfoBox title="Claves de ensayo" items={data.rehearsalNotes} dark={dark} marker="-" />
        <InfoBox title="Decisiones de banda" items={data.decisions} dark={dark} marker="[ ]" />
      </div>
      <div className={cls('grid grid-cols-[1fr_1fr_1fr] gap-4 rounded-2xl border p-4 print:break-inside-avoid', soft)}>
        <div><b>Total:</b> {totalBars} compases aprox.</div>
        <div><b>Fuente:</b> {data.source}</div>
        <div><b>Uso:</b> ensayo / reparto / atril</div>
      </div>
      {showLyrics && data.lyrics && (
        <div className={cls('mt-8 border-t pt-8 print:break-before-page', dark ? 'border-zinc-800' : 'border-zinc-200')}>
          <h2 className="mb-4 text-2xl font-black uppercase tracking-widest">Letra completa</h2>
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {data.lyrics}
          </div>
        </div>
      )}
    </div>
  );
}

function RehearsalPoster({ data, theme, showLyrics }) {
  const totalBars = data.sections.reduce((sum, s) => sum + Number(s.bars || 0), 0);
  const ranges = useMemo(() => getRanges(data.sections), [data.sections]);
  const dark = theme === 'dark';
  const posterBg = dark ? 'bg-zinc-950 text-stone-100' : 'bg-[#faf8f1] text-zinc-900';
  const gridColumns = `140px repeat(${Math.max(data.sections.length, 1)}, minmax(56px, 1fr))`;
  return (
    <div id="poster" className={cls('mx-auto w-[980px] rounded-[2rem] p-6 shadow-2xl print:w-full print:rounded-none print:shadow-none', posterBg)}>
      <div className="relative mb-4 text-center">
        <div className={cls('absolute left-4 top-8 h-[2px] w-36', dark ? 'bg-amber-400' : 'bg-amber-500')} />
        <div className={cls('absolute right-4 top-8 h-[2px] w-36', dark ? 'bg-amber-400' : 'bg-amber-500')} />
        <h1 className={cls('text-6xl font-black uppercase tracking-tight', dark ? 'text-stone-100' : 'text-zinc-950')}>{data.title}</h1>
        <h2 className={cls('mt-1 text-3xl font-extrabold', dark ? 'text-amber-200' : 'text-amber-700')}>{data.artist}</h2>
        <p className="mt-1 text-sm italic opacity-80">{data.subtitle}</p>
      </div>
      <div className="mb-4 grid grid-cols-6 gap-2">
        <HeaderCard icon="music" label="Compás" value={data.meter} theme={theme} />
        <HeaderCard icon="music" label="Tempo" value={data.tempo} theme={theme} />
        <HeaderCard icon="music" label="Tonalidad" value={data.key} theme={theme} />
        <HeaderCard icon="music" label="Paleta" value={data.practicalKey} theme={theme} />
        <HeaderCard icon="music" label="Duración" value={data.duration} theme={theme} />
        <HeaderCard icon="file" label="Fuente" value={data.source} theme={theme} />
      </div>
      <div className={cls('mb-4 rounded-2xl border p-3', dark ? 'border-amber-400/50 bg-black/25' : 'border-zinc-300 bg-white')}>
        <div className={cls('mb-2 text-center text-lg font-black uppercase tracking-[0.25em]', dark ? 'text-amber-200' : 'text-amber-700')}>Estructura por compases</div>
        <div className="space-y-2">
          {data.sections.map((s, i) => {
            const c = getColor(s.color);
            const r = ranges[i] || { start: 0, end: 0 };
            return (
              <div key={s.id} className={cls('grid grid-cols-[54px_240px_120px_1fr] items-stretch overflow-hidden rounded-xl border print:break-inside-avoid', c.border, dark ? c.bg : c.lightBg)}>
                <div className={cls('flex items-center justify-center text-3xl font-black', dark ? 'bg-black/35' : 'bg-zinc-100')}>{i + 1}</div>
                <div className="p-3">
                  <div className="text-xl font-black uppercase tracking-wide">{s.name}</div>
                  <div className="text-xs opacity-80">{s.bars} compases - {r.start}-{r.end}</div>
                  {s.cue && <div className="mt-1 text-[11px] italic opacity-90 leading-tight">"{s.cue}"</div>}
                </div>
                <div className={cls('flex items-center justify-center border-l border-r px-2 text-center text-sm font-bold', dark ? 'border-white/20' : 'border-zinc-200')}>{s.lead}</div>
                <div className="flex items-center px-4 text-2xl font-black tracking-widest">{s.chords}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-4 grid grid-cols-[1.2fr_0.8fr] gap-4">
        <div className={cls('rounded-2xl border p-3', dark ? 'border-amber-400/50 bg-black/25' : 'border-zinc-300 bg-white')}>
          <div className={cls('mb-2 text-center text-lg font-black uppercase tracking-[0.2em]', dark ? 'text-amber-200' : 'text-amber-700')}>Mapa de capas de la banda</div>
          <div className="overflow-hidden rounded-xl border border-white/15">
            <div className="grid" style={{ gridTemplateColumns: gridColumns }}>
              <div className={cls('p-2 text-xs font-bold uppercase', dark ? 'bg-black/50' : 'bg-zinc-100')}>Secciones</div>
              {data.sections.map((s, i) => <div key={s.id} className={cls('p-2 text-center text-[10px] font-black uppercase text-white', getColor(s.color).chip)}>{i + 1}<br />{s.name}</div>)}
              {layerLabels.map(([key, label, icon]) => (
                <React.Fragment key={key}>
                  <div className={cls('flex items-center gap-2 border-t p-2 text-sm font-bold', dark ? 'border-white/10 bg-black/30' : 'border-zinc-200 bg-zinc-50')}><Icon name={icon} className="h-4 w-4" />{label}</div>
                  {data.sections.map((s) => <div key={`${key}-${s.id}`} className={cls('flex items-center justify-center border-t p-2', dark ? 'border-white/10' : 'border-zinc-200')}><span className={cls('h-3 w-11 rounded-full', intensityClass(s.layers ? s.layers[key] : 'media', theme))} /></div>)}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <InfoBox title="Mapa rápido" items={data.sections.map((s) => `${s.name} x${s.bars}`)} dark={dark} marker="-" />
          <InfoBox title="Quién manda" items={[...new Set(data.sections.map((s) => `${s.name}: ${s.lead}`))].slice(0, 8)} dark={dark} marker="-" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <InfoBox title="Claves de ensayo" items={data.rehearsalNotes} dark={dark} marker="-" />
        <InfoBox title="Decisiones" items={data.decisions} dark={dark} marker="[ ]" />
        <InfoBox title="Leyenda" items={Object.values(colorMap).map((v) => v.name)} dark={dark} marker="-" />
        <InfoBox title="Paleta armónica" items={splitPalette(data.practicalKey).slice(0, 8)} dark={dark} marker="-" />
      </div>
      <div className={cls('mt-4 rounded-2xl border p-3 text-center text-xl font-black uppercase tracking-[0.25em]', dark ? 'border-amber-400/50 bg-black/25 text-amber-100' : 'border-zinc-300 bg-white text-zinc-900')}>Total: {totalBars} compases aprox. - estructura clara - ensayo eficiente</div>
      {showLyrics && data.lyrics && (
        <div className={cls('mt-8 border-t pt-8 print:break-before-page', dark ? 'border-white/10' : 'border-zinc-300')}>
          <h2 className="mb-4 text-center text-2xl font-black uppercase tracking-[0.2em] opacity-80">Letra completa</h2>
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {data.lyrics}
          </div>
        </div>
      )}
    </div>
  );
}


function Editor({ data, update, updateSection, updateLayer, setData, onTranspose }) {
  const moveSection = (index, direction) => {
    if (index + direction < 0 || index + direction >= data.sections.length) return;
    setData(d => {
      const newSections = [...d.sections];
      const temp = newSections[index];
      newSections[index] = newSections[index + direction];
      newSections[index + direction] = temp;
      return { ...d, sections: newSections };
    });
  };

  return (
    <>
      <div className="rounded-3xl border border-zinc-300/20 bg-white/80 p-4 shadow-sm dark:bg-zinc-900/80">
        <h2 className="mb-3 text-lg font-black">Datos generales</h2>
        <div className="grid gap-3">
          <Field label="Título" value={data.title} onChange={(v) => update({ title: v })} />
          <Field label="Artista" value={data.artist} onChange={(v) => update({ artist: v })} />
          <Field label="Subtítulo" value={data.subtitle} onChange={(v) => update({ subtitle: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tempo" value={data.tempo} onChange={(v) => update({ tempo: v })} />
            <Field label="Compás" value={data.meter} onChange={(v) => update({ meter: v })} />
            <Field label="Tonalidad" value={data.key} onChange={(v) => update({ key: v })} />
            <Field label="Duración" value={data.duration} onChange={(v) => update({ duration: v })} />
          </div>
          <Field label="Paleta armónica" value={data.practicalKey} onChange={(v) => update({ practicalKey: v })} />
          <Field label="Fuente" value={data.source} onChange={(v) => update({ source: v })} />
        </div>
        <h2 className="mb-3 mt-6 text-lg font-black">Letra completa (opcional)</h2>
        <TextArea label="Pega aquí la letra entera para añadirla al mapa al imprimir" value={data.lyrics || ''} onChange={(v) => update({ lyrics: v })} />
        <div className="mt-4"><TransposeBox onTranspose={onTranspose} /></div>
        <h2 className="mb-3 mt-6 text-lg font-black">Notas de ensayo</h2>
        <TextArea label="Una nota por línea" value={data.rehearsalNotes.join('\n')} onChange={(v) => update({ rehearsalNotes: v.split('\n').filter(Boolean) })} />
        <h2 className="mb-3 mt-6 text-lg font-black">Decisiones de banda</h2>
        <TextArea label="Una decisión por línea" value={data.decisions.join('\n')} onChange={(v) => update({ decisions: v.split('\n').filter(Boolean) })} />
      </div>

      <div className="rounded-3xl border border-zinc-300/20 bg-white/80 p-4 shadow-sm dark:bg-zinc-900/80">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-black">Secciones</h2><button onClick={() => setData((d) => ({ ...d, sections: [...d.sections, emptySection()] }))} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white"><Icon name="plus" className="mr-1 h-4 w-4" /> Añadir</button></div>
        <div className="space-y-3">
          {data.sections.map((s, index) => (
            <div key={s.id} className="rounded-2xl border border-zinc-300/30 bg-white/60 p-3 dark:bg-black/20">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <div className="font-black mr-2">#{index + 1}</div>
                  <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 text-sm disabled:opacity-30 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700" title="Subir sección">↑</button>
                  <button onClick={() => moveSection(index, 1)} disabled={index === data.sections.length - 1} className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 text-sm disabled:opacity-30 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700" title="Bajar sección">↓</button>
                </div>
                <div className="flex items-center gap-2">
                  <select value={s.color} onChange={(e) => updateSection(s.id, { color: e.target.value })} className="rounded-lg bg-white px-2 py-1 text-sm text-zinc-900">
                    {Object.keys(colorMap).map((key) => <option key={key} value={key}>{colorMap[key].name}</option>)}
                  </select>
                  <button onClick={() => setData((d) => ({ ...d, sections: d.sections.filter((x) => x.id !== s.id) }))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-500"><Icon name="trash" className="h-3 w-3" /></button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <Field label="Nombre" value={s.name} onChange={(v) => updateSection(s.id, { name: v })} className="md:col-span-2" />
                <Field label="Compases" value={String(s.bars)} onChange={(v) => updateSection(s.id, { bars: Number(v) || 0 })} />
                <Field label="Quién manda" value={s.lead} onChange={(v) => updateSection(s.id, { lead: v })} />
                <Field label="Acordes" value={s.chords} onChange={(v) => updateSection(s.id, { chords: v })} className="md:col-span-3" />
                <Field label="Nota / Observaciones" value={s.notes} onChange={(v) => updateSection(s.id, { notes: v })} className="md:col-span-2" />
                <Field label="Frase clave (letra de entrada)" value={s.cue || ''} onChange={(v) => updateSection(s.id, { cue: v })} className="md:col-span-2" />
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {layerLabels.map(([key, label]) => <label key={key} className="text-xs font-bold uppercase opacity-80">{label}<select value={(s.layers && s.layers[key]) || 'media'} onChange={(e) => updateLayer(s.id, key, e.target.value)} className="mt-1 w-full rounded-lg bg-white px-2 py-1 text-zinc-900"><option value="baja">baja</option><option value="media">media</option><option value="alta">alta</option></select></label>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AiPanel({ analysisPrompt, copyPrompt, copied, jsonText, setJsonText, importJSON }) {
  const [songRequest, setSongRequest] = useState({ title: '', artist: '', link: '', version: 'versión de estudio / oficial', key: 'original o práctica para banda', notes: '' });
  const [requestCopied, setRequestCopied] = useState(false);
  const generatedRequest = useMemo(() => buildSongRequestPrompt(songRequest), [songRequest]);
  const updateRequest = (patch) => setSongRequest((current) => ({ ...current, ...patch }));
  const copyGeneratedRequest = async () => {
    try {
      await navigator.clipboard.writeText(generatedRequest);
      setRequestCopied(true);
      setTimeout(() => setRequestCopied(false), 1500);
    } catch {
      setJsonText(generatedRequest);
      alert('No se pudo copiar automáticamente. He colocado la petición en el cuadro de texto.');
    }
  };
  const createSkeletonFromRequest = () => setJsonText(JSON.stringify(makeSkeleton(songRequest), null, 2));
  return (
    <div className="lg:col-span-2 grid gap-4">
      <div className="rounded-3xl border border-amber-300/30 bg-white/80 p-4 shadow-sm dark:bg-zinc-900/80">
        <h2 className="mb-2 text-lg font-black">Pedir JSON de una canción</h2>
        <p className="mb-3 text-sm opacity-70">Rellena estos datos y copia la petición para enviársela a ChatGPT/Gemini. Cuando te devuelva el JSON, pégalo en Importar JSON.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Canción" value={songRequest.title} onChange={(v) => updateRequest({ title: v })} />
          <Field label="Artista" value={songRequest.artist} onChange={(v) => updateRequest({ artist: v })} />
          <Field label="Enlace / fuente" value={songRequest.link} onChange={(v) => updateRequest({ link: v })} />
          <Field label="Versión" value={songRequest.version} onChange={(v) => updateRequest({ version: v })} />
          <Field label="Tonalidad deseada" value={songRequest.key} onChange={(v) => updateRequest({ key: v })} />
          <Field label="Notas para la banda" value={songRequest.notes} onChange={(v) => updateRequest({ notes: v })} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copyGeneratedRequest} className="rounded-xl bg-amber-500 px-3 py-2 font-black text-black"><Icon name="clipboard" className="mr-1 h-4 w-4" /> {requestCopied ? 'Petición copiada' : 'Copiar petición'}</button>
          <button onClick={createSkeletonFromRequest} className="rounded-xl bg-zinc-700 px-3 py-2 font-bold text-white"><Icon name="file" className="mr-1 h-4 w-4" /> Crear plantilla JSON editable</button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-300/20 bg-white/80 p-4 shadow-sm dark:bg-zinc-900/80"><h2 className="mb-2 text-lg font-black">Prompt maestro</h2><p className="mb-3 text-sm opacity-70">Instrucción general del sistema.</p><pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-zinc-950 p-4 text-xs text-zinc-100">{analysisPrompt}</pre><button onClick={copyPrompt} className="mt-3 rounded-xl bg-amber-500 px-3 py-2 font-black text-black"><Icon name="clipboard" className="mr-1 h-4 w-4" /> {copied ? 'Copiado' : 'Copiar prompt maestro'}</button></div>
        <div className="rounded-3xl border border-zinc-300/20 bg-white/80 p-4 shadow-sm dark:bg-zinc-900/80"><h2 className="mb-2 text-lg font-black">Importar JSON</h2><textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} rows={17} placeholder="Pega aquí el JSON generado por la IA..." className="w-full rounded-2xl border border-zinc-300/30 bg-white p-4 font-mono text-xs text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100" /><button onClick={importJSON} className="mt-3 rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white"><Icon name="upload" className="mr-1 h-4 w-4" /> Importar a la app</button></div>
      </div>
    </div>
  );
}

function TestsPanel({ selfTests }) {
  return <div className="lg:col-span-2 rounded-3xl border border-zinc-300/20 bg-white/80 p-4 shadow-sm dark:bg-zinc-900/80"><h2 className="mb-3 text-lg font-black">Tests internos</h2><p className="mb-4 text-sm opacity-70">Comprueban normalización del JSON, cálculos y transposición.</p><div className="space-y-2">{selfTests.map((test) => <div key={test.name} className={cls('rounded-xl border p-3 font-bold', test.pass ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-red-400 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100')}>{test.pass ? 'OK' : 'ERROR'} - {test.name}</div>)}</div></div>;
}

function Toolbar({ theme, setTheme, outputMode, setOutputMode, showLyrics, setShowLyrics, setData, exportJSON }) {
  return (
    <div className="no-print mx-auto mb-4 flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-300/20 bg-white/70 p-3 shadow-sm backdrop-blur dark:bg-zinc-900/70">
      <div><h1 className="text-xl font-black">Generador de Mapas de Ensayo para Banda</h1><p className="text-sm opacity-70">Edita la canción, pega JSON, transpone y exporta.</p></div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setData(cloneSong(blankPreset))} className="rounded-xl bg-zinc-200 px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-300">Vacío</button>
        <button onClick={() => setData(cloneSong(fitoPreset))} className="rounded-xl bg-zinc-200 px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-300">Ejemplo Fito</button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-black text-black hover:bg-amber-400"><Icon name={theme === 'dark' ? 'sun' : 'moon'} className="mr-1 h-4 w-4" /> Tema</button>
        <button onClick={() => setOutputMode(outputMode === 'poster' ? 'sheet' : 'poster')} className="rounded-xl bg-purple-600 px-3 py-2 text-sm font-bold text-white hover:bg-purple-500"><Icon name="file" className="mr-1 h-4 w-4" /> {outputMode === 'poster' ? 'Hoja A4' : 'Póster'}</button>
        <button onClick={() => setShowLyrics(!showLyrics)} className={cls('rounded-xl px-3 py-2 text-sm font-bold', showLyrics ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300')}><Icon name="clipboard" className="mr-1 h-4 w-4" /> Letra</button>
        <button onClick={() => window.print()} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-500"><Icon name="printer" className="mr-1 h-4 w-4" /> PDF</button>
        <button onClick={exportJSON} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-500"><Icon name="download" className="mr-1 h-4 w-4" /> JSON</button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return <button onClick={onClick} className={cls('rounded-xl px-4 py-2 font-bold', active ? 'bg-amber-500 text-black' : 'bg-white/70 dark:bg-zinc-900')}><Icon name={icon} className="mr-1 h-4 w-4" /> {label}</button>;
}

export default function App() {
  const [data, setData] = useState(() => cloneSong(fitoPreset));
  const [theme, setTheme] = useState('dark');
  const [tab, setTab] = useState('edit');
  const [outputMode, setOutputMode] = useState('poster');
  const [showLyrics, setShowLyrics] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const effectiveTheme = isPrinting ? 'light' : theme;

  const selfTests = useMemo(() => runSelfTests(), []);
  const analysisPrompt = useMemo(() => buildSongRequestPrompt({ title: '[título]', artist: '[artista]', link: '[opcional]', version: 'versión de estudio / oficial', key: 'original o práctica para banda', notes: '[opcional]' }), []);
  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const updateSection = (id, patch) => setData((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const updateLayer = (id, key, value) => setData((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, layers: { ...s.layers, [key]: value } } : s)) }));
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(analysisPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setJsonText(analysisPrompt);
      alert('No se pudo copiar automáticamente. He colocado el prompt en el cuadro de texto.');
    }
  };
  const importJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setData(normalizeImportedSong(parsed));
      setJsonText('');
      setTab('preview');
    } catch {
      alert('El JSON no es válido. Revisa comas, comillas y corchetes.');
    }
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-')}-mapa-ensayo.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={cls('min-h-screen p-4', effectiveTheme === 'dark' ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-950')}>
      <Toolbar theme={effectiveTheme} setTheme={setTheme} outputMode={outputMode} setOutputMode={setOutputMode} showLyrics={showLyrics} setShowLyrics={setShowLyrics} setData={setData} exportJSON={exportJSON} />
      <div className="no-print mx-auto mb-4 flex max-w-7xl flex-wrap gap-2">
        <TabButton active={tab === 'edit'} onClick={() => setTab('edit')} icon="pencil" label="Editar" />
        <TabButton active={tab === 'ai'} onClick={() => setTab('ai')} icon="wand" label="IA / JSON" />
        <TabButton active={tab === 'tests'} onClick={() => setTab('tests')} icon="file" label="Tests" />
        <TabButton active={tab === 'preview'} onClick={() => setTab('preview')} icon="eye" label="Vista previa" />
      </div>
      {tab !== 'preview' ? (
        <div className="no-print mx-auto mb-6 grid max-w-7xl gap-4 lg:grid-cols-[420px_1fr]">
          {tab === 'edit' ? <Editor data={data} update={update} updateSection={updateSection} updateLayer={updateLayer} setData={setData} onTranspose={(steps) => setData((d) => transposeSongData(d, steps))} /> : null}
          {tab === 'ai' ? <AiPanel analysisPrompt={analysisPrompt} copyPrompt={copyPrompt} copied={copied} jsonText={jsonText} setJsonText={setJsonText} importJSON={importJSON} /> : null}
          {tab === 'tests' ? <TestsPanel selfTests={selfTests} /> : null}
        </div>
      ) : null}
      <div className={cls('mx-auto overflow-auto rounded-3xl', tab === 'preview' ? 'max-w-[1040px]' : 'max-w-7xl')}>
        {outputMode === 'poster' ? <RehearsalPoster data={data} theme={effectiveTheme} showLyrics={showLyrics} /> : <RehearsalSheet data={data} theme={effectiveTheme} showLyrics={showLyrics} />}
      </div>
    </div>
  );
}
