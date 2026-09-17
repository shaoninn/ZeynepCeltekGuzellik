import { createHmac } from "crypto";
import { getSiteUrl } from "@/lib/seo";

/** PayTR iFrame API — https://dev.paytr.com/iframe-api */

export type PaytrConfig = {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
};

export function getPaytrConfig(): PaytrConfig | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID?.trim() || "";
  const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim() || "";
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim() || "";
  if (!merchantId || !merchantKey || !merchantSalt) return null;
  return {
    merchantId,
    merchantKey,
    merchantSalt,
    testMode:
      process.env.PAYTR_TEST_MODE === "1" ||
      process.env.PAYTR_TEST_MODE === "true",
  };
}

export function isPaytrConfigured(): boolean {
  return getPaytrConfig() != null;
}

/** Site ayarı veya env ile kart ödemesi vitrinde açık mı */
export function isPaytrUiEnabled(settingsFlag?: string | null): boolean {
  if (!isPaytrConfigured()) return false;
  if (settingsFlag == null || settingsFlag === "") {
    return (
      process.env.PAYTR_UI_ENABLED === "1" ||
      process.env.PAYTR_UI_ENABLED === "true"
    );
  }
  return settingsFlag === "1" || settingsFlag === "true";
}

export function paytrIframeSrc(iframeToken: string): string {
  return `https://www.paytr.com/odeme/guvenli/${iframeToken}`;
}

export function buildPaytrTokenHash(
  config: PaytrConfig,
  parts: {
    userIp: string;
    merchantOid: string;
    email: string;
    paymentAmountKurus: number;
    userBasketB64: string;
    noInstallment: number;
    maxInstallment: number;
    currency: string;
    testMode: number;
  }
): string {
  const hashStr =
    config.merchantId +
    parts.userIp +
    parts.merchantOid +
    parts.email +
    String(parts.paymentAmountKurus) +
    parts.userBasketB64 +
    String(parts.noInstallment) +
    String(parts.maxInstallment) +
    parts.currency +
    String(parts.testMode);
  return createHmac("sha256", config.merchantKey)
    .update(hashStr + config.merchantSalt)
    .digest("base64");
}

export function verifyPaytrCallbackHash(
  config: PaytrConfig,
  payload: {
    merchantOid: string;
    status: string;
    totalAmount: string;
    hash: string;
  }
): boolean {
  const expected = createHmac("sha256", config.merchantKey)
    .update(
      payload.merchantOid +
        config.merchantSalt +
        payload.status +
        payload.totalAmount
    )
    .digest("base64");
  return expected === payload.hash;
}

/** PayTR basket: [[name, priceTL, qty], ...] → base64 JSON */
export function encodePaytrBasket(
  items: Array<{ name: string; priceTl: number; quantity: number }>
): string {
  const basket = items.map((i) => [
    i.name.slice(0, 120),
    i.priceTl.toFixed(2),
    i.quantity,
  ]);
  return Buffer.from(JSON.stringify(basket), "utf8").toString("base64");
}

export function tlToKurus(amountTl: number): number {
  return Math.round(amountTl * 100);
}

export type PaytrTokenRequest = {
  orderNo: string;
  email: string;
  userName: string;
  userPhone: string;
  userAddress?: string;
  userIp: string;
  paymentAmountTl: number;
  basket: Array<{ name: string; priceTl: number; quantity: number }>;
  okUrl?: string;
  failUrl?: string;
};

export type PaytrTokenResult =
  | { ok: true; iframeToken: string; merchantOid: string }
  | { ok: false; reason: string; detail?: string };

export async function requestPaytrIframeToken(
  input: PaytrTokenRequest
): Promise<PaytrTokenResult> {
  const config = getPaytrConfig();
  if (!config) {
    return { ok: false, reason: "not_configured" };
  }

  const merchantOid = input.orderNo.replace(/[^a-zA-Z0-9]/g, "").slice(0, 64);
  if (!merchantOid) {
    return { ok: false, reason: "invalid_order" };
  }

  const paymentAmountKurus = tlToKurus(input.paymentAmountTl);
  if (paymentAmountKurus < 100) {
    return { ok: false, reason: "amount_too_low" };
  }

  const userBasketB64 = encodePaytrBasket(input.basket);
  const noInstallment = 0;
  const maxInstallment = 0;
  const currency = "TL";
  const testMode = config.testMode ? 1 : 0;
  const base = getSiteUrl();
  const merchantOkUrl =
    input.okUrl ||
    `${base}/odeme/sonuc?status=ok&orderNo=${encodeURIComponent(input.orderNo)}`;
  const merchantFailUrl =
    input.failUrl ||
    `${base}/odeme/sonuc?status=fail&orderNo=${encodeURIComponent(input.orderNo)}`;

  const paytr_token = buildPaytrTokenHash(config, {
    userIp: input.userIp,
    merchantOid,
    email: input.email,
    paymentAmountKurus,
    userBasketB64,
    noInstallment,
    maxInstallment,
    currency,
    testMode,
  });

  const body = new URLSearchParams({
    merchant_id: config.merchantId,
    user_ip: input.userIp,
    merchant_oid: merchantOid,
    email: input.email,
    payment_amount: String(paymentAmountKurus),
    paytr_token,
    user_basket: userBasketB64,
    debug_on: config.testMode ? "1" : "0",
    no_installment: String(noInstallment),
    max_installment: String(maxInstallment),
    user_name: input.userName.slice(0, 60),
    user_address: (input.userAddress || "Adana").slice(0, 400),
    user_phone: input.userPhone.replace(/\D/g, "").slice(0, 20),
    merchant_ok_url: merchantOkUrl,
    merchant_fail_url: merchantFailUrl,
    timeout_limit: "30",
    currency,
    test_mode: String(testMode),
    lang: "tr",
  });

  try {
    const res = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as {
      status?: string;
      token?: string;
      reason?: string;
    };
    if (data.status === "success" && data.token) {
      return { ok: true, iframeToken: data.token, merchantOid };
    }
    return {
      ok: false,
      reason: "paytr_error",
      detail: data.reason || data.status || "token_failed",
    };
  } catch (e) {
    return {
      ok: false,
      reason: "network_error",
      detail: e instanceof Error ? e.message : String(e),
    };
  }
}
