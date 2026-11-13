# Data dictionary

All records are fictional simulation data from batch `SIM70-20261113-A`.

## participants.csv

One row per simulated participant. Key fields are the anonymous synthetic `participant_code`, sequence, method order, fictional schedule, broad synthetic persona attributes, and completion status. Database UUIDs are deliberately excluded from this public dataset.

## tasks.csv

One row per participant-task combination (eight per participant). `method`, `set_id`, and `task_id` identify the assigned condition. `duration_seconds` is derived from the fictional client timestamps. `field_score` is the number of correct fields/categories out of 13, and `accuracy_rate` is `field_score / field_total`. Internal database and submission identifiers are excluded.

## feedback.csv

One row per participant. Confidence and workload use 1–5 scales. `preference` contains Manual, AI-assisted, or No preference. Comments are explicitly labelled simulation text. Internal submission identifiers are excluded.

## Timestamp interpretation

`scheduled_*_local` columns are fictional simulation times in Asia/Kuala_Lumpur. They are not actual participation dates. Supabase server audit timestamps were preserved separately and are not used for the activity charts.
