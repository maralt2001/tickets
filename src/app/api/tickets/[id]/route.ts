import { NextRequest} from 'next/server';
import {updateTickets} from "../../../../../lib/handleData";

export async function PATCH(request:NextRequest,{ params }: { params: Promise<{ id: string }>}) {

    const {status} = await request.json()
    const result = await updateTickets((await params).id, status);

    if (!result) {
        return new Response("Ticket not found", { status: 404 });
    }
    return Response.json(result);
}