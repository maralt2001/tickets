import sql from 'better-sqlite3'

const db = sql('tickets.db');

const tickets = [
    {
        "id": 1,
        "customer": "TechNova GmbH",
        "ticket": 1000456,
        "subject": "Systemintegration prüfen",
        "status": "offen"
    },
    {
        "id": 2,
        "customer": "GreenFuture AG",
        "ticket": 1000498,
        "subject": "Zugangsdaten senden",
        "status": "offen"
    },
    {
        "id": 3,
        "customer": "LogiTrans Logistics",
        "ticket": 1000542,
        "subject": "Systemupdate erforderlich",
        "status": "offen"
    },
    {
        "id": 4,
        "customer": "MediHealth GmbH",
        "ticket": 1000578,
        "subject": "Kundendaten aktualisieren",
        "status": "in Bearbeitung"
    },
    {
        "id": 5,
        "customer": "BlueOcean Ltd.",
        "ticket": 1000604,
        "subject": "Fehleranalyse durchführen",
        "status": "in Bearbeitung"
    },
    {
        "id": 6,
        "customer": "EcoPower Solutions",
        "ticket": 1000623,
        "subject": "Kontaktdaten validieren",
        "status": "in Bearbeitung"
    },
    {
        "id": 7,
        "customer": "SmartBuild Inc.",
        "ticket": 1000657,
        "subject": "Benutzerrollen definieren",
        "status": "in Bearbeitung"
    },
    {
        "id": 8,
        "customer": "NextGen Studios",
        "ticket": 1000698,
        "subject": "Passwort ändern",
        "status": "in Bearbeitung"
    },
    {
        "id": 9,
        "customer": "BrightFinance AG",
        "ticket": 1000721,
        "subject": "Nachrichtensystem testen",
        "status": "in Bearbeitung"
    },
    {
        "id": 10,
        "customer": "Skyline Foods",
        "ticket": 1000754,
        "subject": "Neue Zertifikate einrichten",
        "status": "erledigt"
    }
]

db.prepare('CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, customer TEXT, ticket INTEGER, subject TEXT, status TEXT)').run();

async function initData() {
    const stmt = db.prepare(`
     INSERT INTO tickets (customer, ticket, subject, status) 
     VALUES (@customer, @ticket, @subject, @status)`)
        tickets.forEach(ticket => {
            stmt.run({
                customer: ticket.customer,
                ticket: ticket.ticket,
                subject: ticket.subject,
                status: ticket.status
            });

    })
}

await initData();