'use client'
import styles from "./page.module.css";
import { useState, useEffect} from 'react'

type Ticket = {
    id: number,
    customer: string,
    ticket: number,
    subject: string,
    status: string,
}


export default function Home() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [isSortedAsc, setIsSortedAsc] = useState(false);
    const statusOptions = ['in Bearbeitung','offen','geschlossen','wartend auf Kunde','erledigt'];
    const [loading, setLoading] = useState(true);
    let url = '';
    useEffect(() => {
        if (process.env.DOCKER_HOST != undefined) {
            url = process.env.DOCKER_HOST;
        }
        else {
            url = 'http://localhost:3000';
        }
        fetch(`${url}/api/tickets`) // Tickets von der API abrufen
            .then((res) => res.json())
            .then((data:Ticket[]) => {
                setTickets(data.sort((a, b) => a.ticket - b.ticket));
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error while loading tickets:', err)
                setLoading(false);
            })
    }, []);
    const handleStatusChange = (id:any, newStatus:any):void => {
        // refresh tickets local
        const updatedTickets:Ticket[] = tickets.map((ticket:Ticket) =>
            ticket.id === id ? { ...ticket, status: newStatus } : ticket
        );
        setTickets(updatedTickets);

        // update tickets
        fetch(`${url}/api/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((res) => res.json())
            .then((updatedTicket) => {
                console.log('Server response:', updatedTicket);
            })
            .catch((err) => console.error('Error while loading tickets:', err));
    };

    const handleSortByTicketId = (): void => {
        const sortedTickets = [...tickets].sort((a, b) =>
            isSortedAsc ? a.ticket - b.ticket : b.ticket - a.ticket
        );
        setTickets(sortedTickets);
        setIsSortedAsc(!isSortedAsc); // Toggle Sortierrichtung
    };



    return (
        <div className={styles.page}>
            {loading? (
                <p>Loading Tickets...</p>
            ):(
            <table className={styles.table}>
                <thead className={styles.thead}>
                <tr>
                    <th>CUSTOMER</th>
                    <th
                        onClick={handleSortByTicketId}
                        style={{ cursor: "pointer" }}
                    >
                        TICKET {isSortedAsc ? "⬆️" : "⬇️"}
                    </th>

                    <th>SUBJECT</th>
                    <th>STATUS</th>
                </tr>
                </thead>
                <tbody className={`${styles.tbody} "table-body"`}>
                {tickets.map((ticket:Ticket) => (
                    <tr key={ticket.id} className={ticket.status === 'offen'? styles.openRow : ''}>
                        <td>{ticket.customer}</td>
                        <td>{ticket.ticket}</td>
                        <td>{ticket.subject}</td>
                        <td>
                            <select className={styles.select} id={String(ticket.id)}
                                value={ticket.status}
                                onChange={(e) =>

                                    handleStatusChange(ticket.id, e.target.value)}
                            >
                                {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                        </td>
                    </tr>
                ))}

                </tbody>
            </table>
            )}
        </div>
    );
}
