import sql from 'better-sqlite3'

const db = sql('lib/tickets.db');

type Ticket = {
    id: number,
    customer: string,
    ticket: number,
    subject: string,
    status: string,
}
export async function fetchTickets(): Promise<Ticket[]> {
    try {
        const readTickets = db.prepare('SELECT * FROM tickets').all();
        const tickets = JSON.stringify(readTickets, null, 2);
        return JSON.parse(tickets).sort((a: { ticket: number; }, b: { ticket: number; }) => a.ticket - b.ticket);//return tickets.sort((a, b) => a.ticket - b.ticket);
    } catch (error) {
        console.error("Error read tickets:", error);
        return [];
    }
}

export async function updateTickets(id:string, status:string):Promise<Ticket> {
    const ticketId = parseInt(id,10 );
    const ticketStatus = status;
    const statement = db.prepare(`UPDATE tickets SET status = ? WHERE id = ?`);
    statement.run(ticketStatus, ticketId);
    const readTicket = db.prepare(`SELECT * FROM tickets WHERE id = ${ticketId}`).get();
    const ticket = JSON.stringify(readTicket, null, 2);
    return JSON.parse(ticket);
}