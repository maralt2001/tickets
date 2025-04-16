
import styles from "./page.module.css";
import TicketTableClient from "./TicketTableClient";



type Ticket = {
    id: number,
    customer: string,
    ticket: number,
    subject: string,
    status: string,
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchTickets(): Promise<Ticket[]> {
    try {

        const response = await fetch(`${API_URL}/api/tickets`, { cache: "no-store" });
        if (!response.ok) {
            new Error("Failed to fetch tickets");
            return []
        }
        const tickets: Ticket[] = await response.json();
        return tickets.sort((a, b) => a.ticket - b.ticket);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return [];
    }
}



export default async function Home() {
    const tickets = await fetchTickets()
    const statusOptions = ['in Bearbeitung','offen','geschlossen','wartend auf Kunde','erledigt'];

    return (
        <div className={styles.page}>
            {tickets.length === 0 ? (
                <p>No Tickets found. Error while loading</p>
            ) : (
                <TicketTableClient initialTickets={tickets} statusOptions={statusOptions} apiUrl={`${API_URL}`} />
            )}
        </div>

    );
}
