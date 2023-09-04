const KEY = process.env.CLOUDFLARE_IMAGES_KEY;
const EXPIRATION = 60 * 60 * 24; // 1 day

const bufferToHex = (buffer: ArrayBufferLike) =>
    [...new Uint8Array(buffer)]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');

export async function generateSignedUrl(url: URL) {
    const encoder = new TextEncoder();
    const secretKeyData = encoder.encode(KEY);
    const key = await crypto.subtle.importKey(
        'raw',
        secretKeyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const expiry = Math.floor(Date.now() / 1000) + EXPIRATION;
    url.searchParams.set('exp', String(expiry));
    const stringToSign = url.pathname + '?' + url.searchParams.toString();

    const mac = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(stringToSign),
    );
    const sig = bufferToHex(new Uint8Array(mac).buffer);
    url.searchParams.set('sig', sig);

    return url;
}
