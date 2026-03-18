/**
 * 头像资源管理 — 100 个 DiceBear 头像 URL，混合 4 种 3D/立体风格
 *
 * 风格分布：
 *  - big-smile (35): 3D 彩色卡通脸，最接近 Apple/2.5D
 *  - fun-emoji (25): 3D emoji，圆润立体
 *  - adventurer (25): 彩色插画人物
 *  - personas (15): 专业人像插画
 *
 * 导出：AVATAR_GROUPS / ALL_AVATARS / getRandomAvatar
 */

// ── big-smile 风格 (35) — 3D 彩色卡通 ──
const BIG_SMILE_SEEDS = [
  "Astro", "Blaze", "Cedar", "Dune", "Echo",
  "Flint", "Grove", "Haven", "Ivory", "Jade",
  "Kite", "Lark", "Maple", "Nectar", "Opal",
  "Pine", "Quartz", "Ridge", "Storm", "Thorn",
  "Unity", "Vibe", "Willow", "Xenon", "Yarn",
  "Zephyr", "Amber", "Brook", "Cliff", "Dawn",
  "Ember", "Frost", "Glint", "Halo", "Indie",
];

// ── fun-emoji 风格 (25) — 3D emoji ──
const FUN_EMOJI_SEEDS = [
  "Sunny", "Rocket", "Star", "Comet", "Bloom",
  "Spark", "Candy", "Dream", "Flash", "Jewel",
  "Lucky", "Mango", "Peach", "Ripple", "Sugar",
  "Twist", "Velvet", "Wave", "Zest", "Bubble",
  "Cherry", "Dazzle", "Fizz", "Gummy", "Honey",
];

// ── adventurer 风格 (25) — 彩色插画人物 ──
const ADVENTURER_SEEDS = [
  "Atlas", "Brave", "Crest", "Drake", "Everest",
  "Falcon", "Granite", "Hunter", "Iron", "Journey",
  "Knight", "Legend", "Mystic", "Noble", "Oracle",
  "Phoenix", "Quest", "Raven", "Shield", "Titan",
  "Valor", "Warden", "Zenith", "Archer", "Basalt",
];

// ── personas 风格 (15) — 专业人像插画 ──
const PERSONAS_SEEDS = [
  "Sage", "Scholar", "Maven", "Mentor", "Prodigy",
  "Artisan", "Captain", "Director", "Expert", "Founder",
  "Guide", "Harbor", "Insight", "Keystone", "Luminary",
];

// 生成 URL 的工具函数
const url = (style: string, seed: string) =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

// ── 按风格分组导出 ──
export const AVATAR_GROUPS: Record<string, string[]> = {
  "3D 卡通": BIG_SMILE_SEEDS.map(s => url("big-smile", s)),   // 35
  "Emoji":   FUN_EMOJI_SEEDS.map(s => url("fun-emoji", s)),    // 25
  "插画":    ADVENTURER_SEEDS.map(s => url("adventurer", s)),   // 25
  "专业":    PERSONAS_SEEDS.map(s => url("personas", s)),       // 15
};

// ── 扁平数组（100 个） ──
export const ALL_AVATARS: string[] = Object.values(AVATAR_GROUPS).flat();

/**
 * 随机获取一个头像 URL，可排除已使用的头像
 * @param exclude 需要排除的头像 URL 列表
 */
export function getRandomAvatar(exclude: string[] = []): string {
  const pool = ALL_AVATARS.filter(a => !exclude.includes(a));
  if (pool.length === 0) return ALL_AVATARS[Math.floor(Math.random() * ALL_AVATARS.length)]; // 兜底
  return pool[Math.floor(Math.random() * pool.length)];
}
