import { NextRequest } from 'next/server';

export function PATCH(request,{ params }: { params: { id: string } }) {

    console.log(request.params);

    return new Response(null, {
        status: 200,
    });
}