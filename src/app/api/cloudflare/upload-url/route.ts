import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const token = process.env.CLOUDFLARE_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    const results = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    const data = await results.json();

    if (!data.success) return NextResponse.error(); //TODO: Handle errors

    return NextResponse.json({ uploadURL: data.result });
}
