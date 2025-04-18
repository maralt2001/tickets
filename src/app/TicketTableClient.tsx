'use client';

import {useState} from "react";
import styles from "./page.module.css";

type Ticket = {
    id: number;
    customer: string;
    ticket: number;
    subject: string;
    status: string;
};

type Props = {
    initialTickets: Ticket[];
    statusOptions: string[];
    apiUrl: string;
};

export default function TicketTableClient({ initialTickets, statusOptions, apiUrl }: Props) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [isSortedAsc, setIsSortedAsc] = useState(false);

    // change ticket status
    const handleStatusChange = async (id: number, newStatus: string): Promise<void> => {
        // update tickets local
        const updatedTickets = tickets.map((ticket) =>
            ticket.id === id ? { ...ticket, status: newStatus } : ticket
        );
        setTickets(updatedTickets);

        // send update to server
        try {
            const response = await fetch(`${apiUrl}/api/tickets/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                new Error("Failed to update ticket status");
            }

            const updatedTicket = await response.json();
            console.log("Server response:", updatedTicket);
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    // sort tickets by ticket number
    const handleSortByTicketId = (): void => {
        const sortedTickets = [...tickets].sort((a, b) =>
            isSortedAsc ? a.ticket - b.ticket : b.ticket - a.ticket
        );
        setTickets(sortedTickets);
        setIsSortedAsc(!isSortedAsc);
    };

    return (
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
            <tbody className={`${styles.tbody} table-body`}>
            {tickets.map((ticket) => (
                <tr key={ticket.id} className={ticket.status === "offen" ? styles.openRow : ""}>
                    <td>{ticket.customer}</td>
                    <td>{ticket.ticket}</td>
                    <td>{ticket.subject}</td>
                    <td>
                        <select
                            className={styles.select}
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
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
    );
}