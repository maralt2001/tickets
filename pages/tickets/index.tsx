import styles from './styles.module.css'
import {fetchTickets} from "../../lib/handleData";
import TicketTableClient from "../../app/TicketTableClient";

export const getServerSideProps = async () => {
    const tickets = await fetchTickets();

    const statusOptions = ['in Bearbeitung','offen','geschlossen','wartend auf Kunde','erledigt'];

    return {
        props: {
            initialTickets: tickets,
            statusOptions,
            apiUrl: process.env.BASE_URL || 'http://localhost:3000',
        },
    };
};

export default function Index({initialTickets, statusOptions, apiUrl}) {

    return (
        <div className={styles.page}>
            <TicketTableClient initialTickets={initialTickets} statusOptions={statusOptions} apiUrl={`${apiUrl}`}  />
        </div>
    );
}