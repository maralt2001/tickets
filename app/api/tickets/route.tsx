import { NextRequest} from 'next/server';
import {fetchTickets} from "../../../lib/handleData";

export async function GET(request:NextRequest) {

    const result = await fetchTickets();
    return Response.json(result)
}


