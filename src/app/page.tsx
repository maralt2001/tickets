import { Suspense } from "react";
import styles from "./page.module.css";
import TicketTableClient from "./TicketTableClient";
import {fetchTickets} from "../../lib/handleData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function Home() {
    const tickets = await fetchTickets()
    const statusOptions = ['in Bearbeitung','offen','geschlossen','wartend auf Kunde','erledigt'];

    return (
        <div className={styles.page}>
            <Suspense fallback={<p className={styles.loading}>loading...</p>}>
                <TicketTableClient initialTickets={tickets} statusOptions={statusOptions} apiUrl={`${API_URL}`}  />
            </Suspense>
        </div>
    );
}
