import fs from 'fs';

export function GET(request, response) {

    let data = fs.readFileSync('./data/tickets.json', 'utf8');
    return new Response(data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}



