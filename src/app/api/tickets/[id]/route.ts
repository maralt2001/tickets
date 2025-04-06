import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type Ticket = {
    id: number,
    customer: string,
    ticket: number,
    subject: string,
    status: string,

}
type Tickets = Ticket[]

export async function PATCH(request:NextRequest,{ params }: { params: Promise<{ id: string }>}) {

    const ticketId = parseInt((await params).id, 10);
    const {status} = await request.json()

    const getFileData = fs.readFileSync(path.join(process.cwd(),'data','tickets.json'), 'utf8');
    const tickets:Tickets = JSON.parse(getFileData);
    const ticketIndex = tickets.findIndex((ticket:Ticket) => ticket.id === ticketId);
    if (ticketIndex === -1) {
        return NextResponse.error();
    }
    tickets[ticketIndex].status = status;
    fs.writeFileSync(path.join(process.cwd(),'data','tickets.json'), JSON.stringify(tickets, null, 2));
    return Response.json(tickets[ticketIndex])
}