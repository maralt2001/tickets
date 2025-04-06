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
    const [tickets, setTickets] = useState([])
    const statusOptions = ['weitergeleitet', 'initial weitergeleitet', 'in Arbeit', 'erledigt'];
    useEffect(() => {
        fetch(`http://localhost:3000/api/tickets`) // Tickets von der API abrufen
            .then((res) => res.json())
            .then((data) => setTickets(data))
            .catch((err) => console.error('Error while loading tickets:', err));
    }, []);
    const handleStatusChange = (id:any, newStatus:any):void => {
        // refresh tickets local
        const updatedTickets:Ticket[] = tickets.map((ticket:Ticket) =>
            ticket.id === id ? { ...ticket, status: newStatus } : ticket
        );
        setTickets(updatedTickets);

        // update tickets
        fetch(`http://localhost:3000/api/tickets/${id}`, {
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


    return (
        <div className={styles.page}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                <tr>
                    <th>CUSTOMER</th>
                    <th>TICKET</th>
                    <th>SUBJECT</th>
                    <th>STATUS</th>
                </tr>
                </thead>
                <tbody className={styles.tbody}>
                {tickets.map((ticket:Ticket) => (
                    <tr key={ticket.id}>
                        <td>{ticket.customer}</td>
                        <td>{ticket.ticket}</td>
                        <td>{ticket.subject}</td>
                        <td>
                            <select className={styles.select}
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

        </div>
    );
}
