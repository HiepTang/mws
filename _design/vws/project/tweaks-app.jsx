// tweaks-app.jsx — Tweaks panel for Mississauga Wedding Solutions
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "classic",
  "fontPair": "cormorant",
  "density": "airy"
}/*EDITMODE-END*/;

function TweaksApp() {
  // Initialize from localStorage if present
  const initial = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mws_tweaks') || 'null');
      return stored ? { ...TWEAK_DEFAULTS, ...stored } : TWEAK_DEFAULTS;
    } catch { return TWEAK_DEFAULTS; }
  })();

  const [t, setTweak] = useTweaks(initial);

  // Persist locally so other pages pick up the tweaks
  useEffect(() => {
    localStorage.setItem('mws_tweaks', JSON.stringify(t));
    // re-apply tweaks via shared.js logic
    applyMwsTweaks(t);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Palette">
        <TweakRadio
          value={t.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            { value: 'classic', label: 'Red & Gold' },
            { value: 'jade', label: 'Jade' },
          ]}
        />
        <TweakRadio
          value={t.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            { value: 'plum', label: 'Plum' },
            { value: 'midnight', label: 'Midnight' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Heading font">
        <TweakRadio
          value={t.fontPair}
          onChange={(v) => setTweak('fontPair', v)}
          options={[
            { value: 'cormorant', label: 'Cormorant' },
            { value: 'fraunces', label: 'Fraunces' },
            { value: 'playfair', label: 'Playfair' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Density">
        <TweakRadio
          value={t.density}
          onChange={(v) => setTweak('density', v)}
          options={[
            { value: 'airy', label: 'Airy' },
            { value: 'compact', label: 'Compact' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// Reuse the same applyTweaks logic from shared.js
function applyMwsTweaks(t) {
  const root = document.documentElement;
  const palettes = {
    'classic': { red: '#9a1f2c', gold: '#c9a55e', bg: '#fdfaf5', warm: '#f7efe3' },
    'jade':    { red: '#1f5d4f', gold: '#c9a55e', bg: '#f6f4ee', warm: '#ece8dc' },
    'plum':    { red: '#6e2740', gold: '#b89968', bg: '#faf5ee', warm: '#f0e5d8' },
    'midnight':{ red: '#c4515c', gold: '#d4b370', bg: '#1a1410', warm: '#241c16', dark: true },
  };
  const p = palettes[t.palette] || palettes.classic;
  root.style.setProperty('--red', p.red);
  root.style.setProperty('--gold', p.gold);
  root.style.setProperty('--bg', p.bg);
  root.style.setProperty('--bg-warm', p.warm);
  if (p.dark) {
    root.style.setProperty('--ink', '#f5ebd9');
    root.style.setProperty('--ink-soft', 'rgba(245,235,217,0.78)');
    root.style.setProperty('--ink-muted', 'rgba(245,235,217,0.5)');
    root.style.setProperty('--cream', '#2a221c');
    root.style.setProperty('--line', 'rgba(245,235,217,0.12)');
    root.style.setProperty('--line-soft', 'rgba(245,235,217,0.06)');
  } else {
    root.style.setProperty('--ink', '#1f1814');
    root.style.setProperty('--ink-soft', '#5a4a3f');
    root.style.setProperty('--ink-muted', '#8a7868');
    root.style.setProperty('--cream', '#f5ebd9');
    root.style.setProperty('--line', '#e6dccb');
    root.style.setProperty('--line-soft', '#efe6d6');
  }
  const pairs = {
    'cormorant': '"Cormorant Garamond", Georgia, serif',
    'fraunces':  '"Fraunces", Georgia, serif',
    'playfair':  '"Playfair Display", Georgia, serif',
  };
  if (pairs[t.fontPair]) root.style.setProperty('--serif', pairs[t.fontPair]);
  root.style.setProperty('--gutter', t.density === 'compact' ? 'clamp(16px, 3vw, 40px)' : 'clamp(20px, 4vw, 56px)');
}

const root = document.createElement('div');
root.id = '__tweaks_root';
document.body.appendChild(root);
ReactDOM.createRoot(root).render(<TweaksApp />);
