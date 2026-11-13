# Portfolio analysis methodology

## Scope and data status

This portfolio analysis uses batch `SIM70-20261113-A`: a controlled, fictional simulation created to exercise the experiment platform and demonstrate an end-to-end analytics workflow. The 70 records are not recruited human participants, and the statistical results are not evidence that AI improves real-world document processing.

The analysis uses exported, static copies of three tables:

- `participants.csv`: one row per completed simulated session;
- `tasks.csv`: eight document-processing responses per session;
- `feedback.csv`: one post-task questionnaire per session.

The original exports in `simulation/SIM70-20261113-A` remain unchanged. The dashboard has no live database connection.

## Design represented in the data

The simulated experiment follows a randomized two-period crossover design. Each session completes four manual and four AI-assisted tasks. Sequences S1–S4 vary method order and matched document set allocation so that a session does not process an identical document twice. The allocation contains 35 manual-first and 35 AI-first sessions.

## Measures

- **Accuracy:** `points_earned / points_possible` for each task. Condition means are computed from participant-level condition means.
- **Duration:** elapsed seconds recorded for each task. Condition means are computed from participant-level condition means.
- **Confidence and workload:** post-session ratings on a 1–5 scale for each method.
- **Preference:** manual, AI-assisted, or no preference.
- **Activity:** fictional scheduled local timestamps created by the simulation. They are not actual participation timestamps.

## Statistical approach

The primary descriptive comparison is within-session AI-assisted minus manual performance. For accuracy, duration, confidence, and workload, the script calculates:

1. the manual and AI-assisted means;
2. the mean paired difference;
3. a 95% confidence interval using the paired-difference standard error and the two-sided t critical value for 69 degrees of freedom;
4. a paired t statistic; and
5. Cohen's *dz* (mean paired difference divided by its standard deviation).

These inferential outputs describe the generator's simulated sample only. They must not be interpreted as population estimates, validation of the experiment, or causal evidence about AI tools.

## Quality checks

The reproducible script verifies row counts, unique participant counts, task completeness, feedback completeness, and duplicate task-submission identifiers. Expected batch totals are 70 participant rows, 560 task rows, and 70 feedback rows.

## Limitations

- Outcomes reflect programmed simulation rules, not human behavior.
- The sample size does not substitute for a prospective power analysis for a real study.
- Questionnaire scores and preferences are generated values.
- Simulated timestamps cannot support claims about recruitment patterns.
- Assumptions behind paired t intervals were not established using real observations.
- A real experiment would require finalized consent, privacy, retention, withdrawal, and applicable ethics review before recruitment.
