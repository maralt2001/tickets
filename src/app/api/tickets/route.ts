import fs from 'fs';
import path from 'path';


export function GET() {

    let data = fs.readFileSync(path.join(process.cwd(),'data','tickets.json'), 'utf8');
    return new Response(data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}



