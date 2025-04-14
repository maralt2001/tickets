import fs from 'fs/promises';
import path from 'path';


export async function GET() {

    let data = await fs.readFile(path.join(process.cwd(),'data','tickets.json'), 'utf8');
    return new Response(data, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
}



