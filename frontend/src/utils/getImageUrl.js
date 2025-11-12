export function getImageUrl(imgPath) {
  if (!imgPath) return null;
  const s = String(imgPath).trim();

  if (s.startsWith('http://') || s.startsWith('https://')) return s;

  const baseEnv = import.meta.env.VITE_API_URL || window.location.origin + '/api';
  const base = baseEnv.replace(/\/api\/?$/, '');

  if (s.startsWith('/')) return base + s;
  return base + '/data/img/' + s;
}
