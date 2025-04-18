import fs from "fs/promises";
import path from "path";

type Ticket = {
    id: number,
    customer: string,
    ticket: number,
    subject: string,
    status: string,
}
export async function fetchTickets(): Promise<Ticket[]> {
    try {
        const readTickets = await fs.readFile(path.join(process.cwd(),'data','tickets.json'), 'utf8');
        const tickets: Ticket[] = JSON.parse(readTickets);
        return tickets.sort((a, b) => a.ticket - b.ticket);
    } catch (error) {
        console.error("Error read tickets:", error);
        return [];
    }
}

export async function updateTickets(id:string, status:string):Promise<Ticket> {
    const ticketId = parseInt(id,10 );
    const ticketStatus = status;
    const tickets:Ticket[] = await fetchTickets();
    const ticketIndex = tickets.findIndex((ticket:Ticket) => ticket.id === ticketId);
    if (ticketIndex === -1) {
        return;
    }
    tickets[ticketIndex].status = ticketStatus;
    await fs.writeFile(path.join(process.cwd(),'data','tickets.json'), JSON.stringify(tickets, null, 2));
    return tickets[ticketIndex]
}