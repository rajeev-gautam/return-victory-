/**
 * Heuristics for "fake government portal" style phishing — URL structure + optional page text.
 * Content fetch uses a public CORS proxy; many sites block or return login walls — we degrade gracefully.
 */

const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.cfd', '.sbs', '.cyou'];
const TRUSTED_ROOTS = new Set([
  'linkedin.com',
  'google.com',
  'microsoft.com',
  'github.com',
  'apple.com',
  'amazon.in',
  'amazon.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'wikipedia.org',
  'reddit.com',
  'stackoverflow.com',
  'cloudflare.com',
]);

const URL_SUSPICIOUS_KEYWORDS = [
  'gov-scheme',
  'govscheme',
  'aadhaar-verify',
  'aadhar-verify',
  'pan-verify',
  'income-tax-refund',
  'itr-refund',
  'pf-withdraw',
  'free-money',
  'lucky-draw',
  'kyc-update-urgent',
  'verify-pan',
  'verify-aadhaar',
];

const CONTENT_PHRISHING_PATTERNS = [
  { re: /verify\s+your\s+aadhaar|aadhaar\s+verification\s+required|link\s+aadhaar\s+urgently/i, weight: 28 },
  { re: /your\s+pan\s+card\s+is\s+blocked|pan\s+deactivated|verify\s+pan\s+immediately/i, weight: 28 },
  { re: /government\s+of\s+india.{0,80}(scheme|payment|refund).{0,40}(click|verify|submit)/i, weight: 22 },
  { re: /congratulations.{0,40}you\s+have\s+won|claim\s+your\s+prize|processing\s+fee\s+required/i, weight: 26 },
  { re: /urgent.{0,30}(action\s+required|account\s+suspended|verify\s+now)/i, weight: 14 },
];

function normalizeInput(raw) {
  let s = String(raw).trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  return s;
}

export function parseHostname(urlString) {
  try {
    const u = new URL(urlString);
    return u.hostname.toLowerCase();
  } catch {
    return '';
  }
}

function isTrustedCommercial(hostname) {
  if (!hostname) return false;
  if (TRUSTED_ROOTS.has(hostname)) return true;
  return [...TRUSTED_ROOTS].some((root) => hostname === root || hostname.endsWith(`.${root}`));
}

function isOfficialIndianGov(hostname) {
  return hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in');
}

function hasSuspiciousTld(hostname) {
  return SUSPICIOUS_TLDS.some((t) => hostname.endsWith(t));
}

function urlStructureScore(hostname, fullUrl) {
  const lower = fullUrl.toLowerCase();
  let score = 0;
  const reasons = [];

  if (isOfficialIndianGov(hostname)) {
    return { score: 8, reasons: ['Domain uses an official Indian government suffix (.gov.in / .nic.in).'] };
  }

  if (isTrustedCommercial(hostname)) {
    return {
      score: 12,
      reasons: ['Domain matches a widely known commercial / tech property (low impersonation risk for gov scams).'],
    };
  }

  if (hasSuspiciousTld(hostname)) {
    score += 45;
    reasons.push('Uses a TLD often abused for short-lived phishing sites.');
  }

  if (hostname.includes('xn--')) {
    score += 35;
    reasons.push('Punycode / internationalized domain — often used for look-alike attacks.');
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.includes('[')) {
    score += 40;
    reasons.push('Host is an IP or unusual literal — uncommon for legitimate government portals.');
  }

  if (lower.includes('@')) {
    score += 25;
    reasons.push('URL contains "@" — can be used to obscure the real host.');
  }

  for (const kw of URL_SUSPICIOUS_KEYWORDS) {
    if (lower.includes(kw)) {
      score += 22;
      reasons.push(`Suspicious keyword in URL: “${kw.replace(/-/g, ' ')}”.`);
    }
  }

  if (/government|sarkar|ministry|nic|gov/i.test(lower) && !isOfficialIndianGov(hostname) && !isTrustedCommercial(hostname)) {
    score += 18;
    reasons.push('URL mentions government / ministry style terms but is not on .gov.in / .nic.in — possible impersonation.');
  }

  // Non-gov, non-whitelisted: mild uncertainty, not "suspicious" by default
  if (reasons.length === 0) {
    score += 15;
    reasons.push('Not an Indian government domain — exercise normal caution for personal data.');
  }

  return { score: Math.min(100, score), reasons };
}

function stripHtml(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80000);
}

async function fetchPageTextViaProxy(pageUrl) {
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`;
  const res = await fetch(proxy);
  if (!res.ok) throw new Error('proxy_http');
  const data = await res.json();
  const raw = data?.contents;
  if (typeof raw !== 'string' || !raw.length) throw new Error('empty');
  return stripHtml(raw);
}

function analyzeContent(text, hostname) {
  if (!text || text.length < 80) {
    return {
      score: 0,
      reasons: ['Page content could not be loaded or was too short (login wall, blocking, or CORS). Verdict uses URL heuristics.'],
    };
  }

  let score = 0;
  const reasons = [];

  for (const { re, weight } of CONTENT_PHRISHING_PATTERNS) {
    if (re.test(text)) {
      score += weight;
      reasons.push(`Page text matches a common scam / urgency pattern (${re.source.slice(0, 48)}…).`);
    }
  }

  if (!isOfficialIndianGov(hostname) && !isTrustedCommercial(hostname)) {
    const asksSensitive =
      /aadhaar\s*(number|no\.?)|\bPAN\b|pan\s*number|otp|net\s*banking|i\s*agree\s*to\s*share/i.test(text);
    const claimsGov = /government\s+of\s+india|ministry\s+of|official\s+portal|income\s+tax\s+department/i.test(text);
    if (asksSensitive && claimsGov) {
      score += 30;
      reasons.push('Page asks for sensitive identifiers while claiming to be a government portal, but the domain is not .gov.in / .nic.in.');
    }
  }

  return { score: Math.min(100, score), reasons };
}

function combineScores(urlPart, contentPart) {
  // Weight URL higher when content is missing; blend when both exist
  const urlW = contentPart.reasons.some((r) => r.includes('could not be loaded')) ? 1 : 0.55;
  const contentW = 1 - urlW;
  const blended = Math.round(urlPart.score * urlW + contentPart.score * contentW);
  return Math.min(100, blended);
}

function toStatus(score) {
  if (score <= 28) return 'safe';
  if (score <= 59) return 'suspicious';
  return 'dangerous';
}

/**
 * @returns {Promise<{ score: number, status: string, reasons: string[], contentFetched: boolean }>}
 */
export async function runPortalAnalysis(inputUrl) {
  const normalized = normalizeInput(inputUrl);
  if (!normalized) {
    return { score: 0, status: 'safe', reasons: ['Enter a valid URL.'], contentFetched: false };
  }

  let hostname;
  try {
    hostname = parseHostname(normalized);
  } catch {
    return { score: 50, status: 'suspicious', reasons: ['Could not parse this URL.'], contentFetched: false };
  }

  const urlPart = urlStructureScore(hostname, normalized);

  let contentPart = { score: 0, reasons: [] };
  let contentFetched = false;

  try {
    const text = await fetchPageTextViaProxy(normalized);
    contentFetched = text.length >= 80;
    if (isTrustedCommercial(hostname) || isOfficialIndianGov(hostname)) {
      contentPart = {
        score: 0,
        reasons: [
          isOfficialIndianGov(hostname)
            ? 'Official domain — page text not used to raise risk (focus is impersonation of other sites).'
            : 'Known major domain — scam-text rules skipped to avoid false positives.',
        ],
      };
    } else {
      contentPart = analyzeContent(text, hostname);
    }
  } catch {
    contentPart = analyzeContent('', hostname);
  }

  const score = combineScores(urlPart, contentPart);
  const reasons = [...urlPart.reasons, ...contentPart.reasons];

  return {
    score,
    status: toStatus(score),
    reasons,
    contentFetched,
  };
}
