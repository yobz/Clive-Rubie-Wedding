CREATE TABLE IF NOT EXISTS invitations (
 id uuid PRIMARY KEY,
 main_guest_name text NOT NULL CHECK (length(main_guest_name) BETWEEN 2 AND 100),
 reserved_seats integer NOT NULL CHECK (reserved_seats BETWEEN 1 AND 30),
 token_hash text NOT NULL UNIQUE,
 revoked boolean NOT NULL DEFAULT false,
 sent boolean NOT NULL DEFAULT false,
 attendance text CHECK (attendance IN ('attending','declining')),
 additional_names text[] NOT NULL DEFAULT '{}',
 message text NOT NULL DEFAULT '',
 submitted_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (attendance IS DISTINCT FROM 'attending' OR cardinality(additional_names) + 1 <= reserved_seats)
);
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS token_ciphertext text;

ALTER TABLE invitations ADD COLUMN IF NOT EXISTS guest_group text CHECK (guest_group IN ('bride','groom'));

CREATE TABLE IF NOT EXISTS invitation_errors (
 id uuid PRIMARY KEY,
 stage text NOT NULL,
 error_code text NOT NULL,
 token_reference text,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invitation_errors_created_at_idx ON invitation_errors(created_at);

CREATE TABLE IF NOT EXISTS admin_notification_reads (notification_key text PRIMARY KEY, read_at timestamptz NOT NULL DEFAULT now());

ALTER TABLE invitations ADD COLUMN IF NOT EXISTS message_only boolean NOT NULL DEFAULT false;
