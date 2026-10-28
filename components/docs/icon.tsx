const PRO_ONLY: Record<string, string> = {
  'hand-wave': 'hand',
  sparkles: 'wand-magic-sparkles',
  'list-radio': 'list-ul',
  'person-ski-jumping': 'person-skiing',
};

const BRANDS = new Set(['apple', 'linux', 'windows', 'github', 'docker', 'slack', 'google', 'aws', 'python', 'rust', 'node-js', 'npm']);

export function Icon({ icon, className }: { icon?: string; className?: string }) {
  if (!icon) return null;
  const name = PRO_ONLY[icon] ?? icon;
  const style = BRANDS.has(name) ? 'fa-brands' : 'fa-solid';
  return <i aria-hidden className={`${style} fa-${name} ${className ?? ''}`} />;
}
