import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
const schema = z.object({
	requestId: z.string().uuid(),
	name: z.string().trim().min(2).max(100),
	attendance: z.enum(['attending', 'declining']),
	dietary: z.string().trim().max(500),
	song: z.string().trim().max(200),
});

export async function POST(request: Request) {
	if (request.headers.get('origin') !== new URL(request.url).origin) {
		return Response.json(
			{ error: 'Please submit from the invitation page.' },
			{ status: 403 },
		);
	}

	const body = await request.text();
	if (body.length > 5000) {
		return Response.json({ error: 'Your response is too long.' }, { status: 413 });
	}

	let input;
	try {
		input = schema.safeParse(JSON.parse(body));
	} catch {
		return Response.json(
			{ error: 'Please check your response and try again.' },
			{ status: 400 },
		);
	}

	if (!input.success) {
		return Response.json(
			{ error: 'Please enter your full name and check the field lengths.' },
			{ status: 400 },
		);
	}

	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		return Response.json(
			{ error: 'RSVP is temporarily unavailable. Please try again later.' },
			{ status: 503 },
		);
	}

	try {
		const sql = neon(databaseUrl);
		const data = input.data;
		await sql`
			INSERT INTO responses (id, name, attendance, dietary, song, created_at)
			VALUES (
				${data.requestId},
				${data.name},
				${data.attendance},
				${data.attendance === 'attending' ? data.dietary : ''},
				${data.attendance === 'attending' ? data.song : ''},
				${new Date().toISOString()}
			)
			ON CONFLICT (id) DO NOTHING
		`;
		return Response.json({ ok: true }, { status: 201 });
	} catch {
		return Response.json(
			{ error: 'We couldn’t save your RSVP. Your entries are still here; please try again.' },
			{ status: 503 },
		);
	}
}
