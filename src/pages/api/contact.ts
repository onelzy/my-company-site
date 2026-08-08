/**
 * POST /api/contact — lead capture endpoint.
 *
 * Receives submissions from the contact-sales form, the contact page form,
 * and the global lead-capture modal, then pushes a notification to the OWON
 * Feishu group via a custom-bot webhook.
 *
 * Required env var (Cloudflare Pages → Settings → Environment variables):
 *   FEISHU_WEBHOOK_URL = https://open.feishu.cn/open-apis/bot/v2/hook/<token>
 */
import type { APIRoute } from 'astro';

function cleanField(s: string | null | undefined, max = 500): string {
  if (!s) return '';
  return s
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, max);
}

function cleanMessage(s: string | null | undefined, max = 1200): string {
  if (!s) return '';
  return s
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, max);
}

function getWebhook(locals: unknown): string {
  const runtime = (locals as { runtime?: { env?: Record<string, string | undefined> } })?.runtime;
  return (
    runtime?.env?.FEISHU_WEBHOOK_URL || (typeof process !== 'undefined' ? (process.env.FEISHU_WEBHOOK_URL ?? '') : '')
  );
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const webhook = getWebhook(locals);
    if (!webhook) {
      console.error('[contact] FEISHU_WEBHOOK_URL is not configured');
      return json({ ok: false, error: 'not_configured' }, 500);
    }

    // Parse body: JSON (fetch) or form-encoded (native submit fallback).
    const data: Record<string, string> = {};
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const parsed = await request.json().catch(() => null);
      if (!parsed || typeof parsed !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
      Object.assign(data, parsed);
    } else {
      const fd = await request.formData().catch(() => null);
      if (!fd) return json({ ok: false, error: 'bad_request' }, 400);
      fd.forEach((v, k) => {
        if (typeof v === 'string') data[k] = v;
      });
    }

    // Honeypot: bots fill hidden fields that humans never see.
    if (data.company_website || data.website || data._honey) {
      return json({ ok: true, dropped: true });
    }

    const email = cleanField(data.businessEmail || data.email || data.lead_email || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'invalid_email' }, 400);
    }

    const name = cleanField(data.fullName || data.name || '');
    const company = cleanField(data.companyName || data.company || '');
    const phone = cleanField(data.phoneNumber || '');
    const message = cleanMessage(data.message || '');
    const source = cleanField(data.source || 'website');
    const scenario = cleanField(data.scenario || '');
    const product = cleanField(data.product || '');
    const pageUrl = cleanField(data.pageUrl || '');

    const lines: string[] = [];
    lines.push(`🔔 新询盘 — ${source}`);
    if (scenario) lines.push(`📌 场景: ${scenario}`);
    if (product) lines.push(`📦 产品: ${product}`);
    lines.push(`👤 姓名: ${name || '-'}`);
    lines.push(`📧 邮箱: ${email}`);
    if (company) lines.push(`🏢 公司: ${company}`);
    if (phone) lines.push(`📞 电话: ${phone}`);
    if (message) lines.push(`💬 留言:\n${message}`);
    if (pageUrl) lines.push(`🔗 来源页: ${pageUrl}`);
    lines.push(`🕐 ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false })}`);

    const text = lines.join('\n');
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ msg_type: 'text', content: { text } }),
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      console.error('[contact] feishu webhook error', resp.status, body.slice(0, 200));
      return json({ ok: false, error: 'notify_failed' }, 502);
    }

    // Native (no-JS) submits navigate to the response; send them back with
    // an HTML redirect (meta refresh + JS fallback — works everywhere).
    const acceptsHtml = (request.headers.get('accept') || '').includes('text/html');
    if (acceptsHtml) {
      const html =
        '<!doctype html><html><head><meta charset="utf-8">' +
        '<meta http-equiv="refresh" content="0;url=/contact-sales?thanks=1">' +
        '<script>location.replace("/contact-sales?thanks=1")</scr' +
        'ipt></head><body></body></html>';
      return new Response(html, {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
    return json({ ok: true });
  } catch (err) {
    console.error('[contact] unexpected error', err);
    return json({ ok: false, error: 'server_error' }, 500);
  }
};
