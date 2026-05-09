/**
 * Currency support for SpendLens AI audit.
 *
 * All internal engine values are stored in USD.
 * Conversion + formatting happens at display-time only.
 *
 * Exchange rates are intentionally hardcoded (approximations as of 2025).
 * Users can override the auto-detected currency via the selector.
 * No external API calls — fully deterministic.
 */

export interface CurrencyConfig {
  code: string;          // ISO 4217
  symbol: string;        // Display symbol
  name: string;          // Human-readable name
  rateToUsd: number;     // 1 USD = rateToUsd of this currency
  locale: string;        // BCP-47 locale for Intl.NumberFormat
}

// ─── Currency table ────────────────────────────────────────────────────────────
// Rate = how many units of this currency equal 1 USD
export const CURRENCIES: CurrencyConfig[] = [
  { code: "USD", symbol: "$",   name: "US Dollar",         rateToUsd: 1,       locale: "en-US"  },
  { code: "EUR", symbol: "€",   name: "Euro",              rateToUsd: 0.92,    locale: "de-DE"  },
  { code: "GBP", symbol: "£",   name: "British Pound",     rateToUsd: 0.79,    locale: "en-GB"  },
  { code: "INR", symbol: "₹",   name: "Indian Rupee",      rateToUsd: 83.5,    locale: "en-IN"  },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar",   rateToUsd: 1.36,    locale: "en-CA"  },
  { code: "AUD", symbol: "A$",  name: "Australian Dollar", rateToUsd: 1.53,    locale: "en-AU"  },
  { code: "SGD", symbol: "S$",  name: "Singapore Dollar",  rateToUsd: 1.34,    locale: "en-SG"  },
  { code: "JPY", symbol: "¥",   name: "Japanese Yen",      rateToUsd: 149.5,   locale: "ja-JP"  },
  { code: "CNY", symbol: "¥",   name: "Chinese Yuan",      rateToUsd: 7.24,    locale: "zh-CN"  },
  { code: "KRW", symbol: "₩",   name: "South Korean Won",  rateToUsd: 1325,    locale: "ko-KR"  },
  { code: "BRL", symbol: "R$",  name: "Brazilian Real",    rateToUsd: 4.97,    locale: "pt-BR"  },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso",      rateToUsd: 17.15,   locale: "es-MX"  },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso",    rateToUsd: 890,     locale: "es-AR"  },
  { code: "CHF", symbol: "Fr",  name: "Swiss Franc",       rateToUsd: 0.90,    locale: "de-CH"  },
  { code: "SEK", symbol: "kr",  name: "Swedish Krona",     rateToUsd: 10.42,   locale: "sv-SE"  },
  { code: "NOK", symbol: "kr",  name: "Norwegian Krone",   rateToUsd: 10.55,   locale: "nb-NO"  },
  { code: "DKK", symbol: "kr",  name: "Danish Krone",      rateToUsd: 6.87,    locale: "da-DK"  },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar",rateToUsd: 1.63,    locale: "en-NZ"  },
  { code: "ZAR", symbol: "R",   name: "South African Rand",rateToUsd: 18.62,   locale: "en-ZA"  },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham",        rateToUsd: 3.67,    locale: "ar-AE"  },
  { code: "SAR", symbol: "﷼",   name: "Saudi Riyal",       rateToUsd: 3.75,    locale: "ar-SA"  },
  { code: "TRY", symbol: "₺",   name: "Turkish Lira",      rateToUsd: 32.5,    locale: "tr-TR"  },
  { code: "PLN", symbol: "zł",  name: "Polish Złoty",      rateToUsd: 3.95,    locale: "pl-PL"  },
  { code: "CZK", symbol: "Kč",  name: "Czech Koruna",      rateToUsd: 22.7,    locale: "cs-CZ"  },
  { code: "HUF", symbol: "Ft",  name: "Hungarian Forint",  rateToUsd: 355,     locale: "hu-HU"  },
  { code: "THB", symbol: "฿",   name: "Thai Baht",         rateToUsd: 34.8,    locale: "th-TH"  },
  { code: "IDR", symbol: "Rp",  name: "Indonesian Rupiah", rateToUsd: 15750,   locale: "id-ID"  },
  { code: "MYR", symbol: "RM",  name: "Malaysian Ringgit", rateToUsd: 4.72,    locale: "ms-MY"  },
  { code: "PHP", symbol: "₱",   name: "Philippine Peso",   rateToUsd: 56.2,    locale: "en-PH"  },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar",  rateToUsd: 7.82,    locale: "zh-HK"  },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

// ─── Lookup ────────────────────────────────────────────────────────────────────
export function getCurrencyByCode(code: string): CurrencyConfig {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
}

// ─── Auto-detect from browser locale ──────────────────────────────────────────
/**
 * Best-effort guess based on navigator.language.
 * Falls back to USD if no match found.
 * Call only on the client (inside useEffect / event handlers).
 */
export function detectCurrencyFromLocale(): CurrencyConfig {
  if (typeof navigator === "undefined") return DEFAULT_CURRENCY;

  const locale = navigator.language; // e.g. "en-IN", "de-DE", "ja-JP"

  // Try exact locale match first
  const exact = CURRENCIES.find((c) => c.locale === locale);
  if (exact) return exact;

  // Try matching on region subtag: "en-IN" → "IN"
  const region = locale.split("-")[1]?.toUpperCase();
  if (region) {
    // Map common region codes → currency codes
    const regionMap: Record<string, string> = {
      IN: "INR", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
      NL: "EUR", BE: "EUR", AT: "EUR", PT: "EUR", IE: "EUR", FI: "EUR",
      CA: "CAD", AU: "AUD", SG: "SGD", JP: "JPY", CN: "CNY", KR: "KRW",
      BR: "BRL", MX: "MXN", AR: "ARS", CH: "CHF", SE: "SEK", NO: "NOK",
      DK: "DKK", NZ: "NZD", ZA: "ZAR", AE: "AED", SA: "SAR", TR: "TRY",
      PL: "PLN", CZ: "CZK", HU: "HUF", TH: "THB", ID: "IDR", MY: "MYR",
      PH: "PHP", HK: "HKD",
    };
    const code = regionMap[region];
    if (code) return getCurrencyByCode(code);
  }

  return DEFAULT_CURRENCY;
}

// ─── Conversion ────────────────────────────────────────────────────────────────
/** Convert a USD amount to the target currency. */
export function usdTo(usd: number, currency: CurrencyConfig): number {
  return usd * currency.rateToUsd;
}

/** Convert a local amount to USD. */
export function toUsd(local: number, currency: CurrencyConfig): number {
  return local / currency.rateToUsd;
}

// ─── Formatting ────────────────────────────────────────────────────────────────
/**
 * Format a USD amount as local currency, compact style.
 * e.g. usdTo(1250, INR) → "₹1.0L" or "₹1,04,375"
 */
export function formatCurrency(usd: number, currency: CurrencyConfig): string {
  const local = usdTo(usd, currency);

  // For very large numbers use compact notation
  try {
    if (local >= 100_000) {
      return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(local);
    }
    if (local >= 1_000) {
      return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: 0,
      }).format(local);
    }
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: local < 10 ? 2 : 0,
    }).format(local);
  } catch {
    // Fallback if Intl not available or currency code unsupported
    return `${currency.symbol}${local.toFixed(0)}`;
  }
}

/**
 * Format a compact version (for hero headline).
 * e.g. $4,800/yr → "$4.8k"
 */
export function formatCurrencyCompact(usd: number, currency: CurrencyConfig): string {
  const local = usdTo(usd, currency);
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(local);
  } catch {
    if (local >= 1000) {
      return `${currency.symbol}${(local / 1000).toFixed(1)}k`;
    }
    return `${currency.symbol}${local.toFixed(0)}`;
  }
}
