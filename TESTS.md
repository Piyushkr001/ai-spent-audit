# Tests

This project uses **Vitest** for testing the core deterministic business logic of the Audit Engine.

## Running Tests
To run the test suite, execute the following command:
```bash
bun run test
```

## Test Suite: `tests/audit-engine.test.ts`

The tests validate the `runAudit` function in `lib/audit/engine.ts`. We test the deterministic rules thoroughly to ensure financial calculations are strictly correct before saving to the database.

### Test Cases
1. **`calculates total monthly spend correctly`**: Verifies that adding multiple tools (e.g., Cursor, ChatGPT) correctly sums the `monthlySpend` column.
2. **`calculates annual savings correctly based on overpaying`**: Validates Rule 1. If a user inputs $120/mo for 3 seats of a $20/mo tool, the engine should flag a $60/mo savings and $720/yr savings.
3. **`handles low savings / already optimal case`**: Ensures that an optimized stack returns `isSpendingWell: true` with a $0 savings count and a positive summary message.
4. **`shows Credex CTA for high savings cases`**: Confirms that if `totalMonthlySavings` > $500, `showCredexCTA` is toggled to true and the summary message prompts a Credex consultation.
5. **`recommends action for high API spend without cost controls`**: Validates Rule 5. API tool spend over $500/mo without restrictions should generate a warning to implement budget limits.
6. **`normalizes currency correctly via toUsd`**: Verifies that foreign currencies are converted to USD accurately for engine rule thresholds.
7. **`gives warning for small team on Enterprise plan`**: Validates Rule 2. Checks if a team size is small but they selected an Enterprise tier, suggesting a downgrade.
8. **`handles Claude Max and Enterprise plans without errors`**: Ensures that new Anthropic tool plans pass cleanly through the engine.
9. **`handles Gemini Pro and Ultra plans`**: Confirms correct calculations and rules trigger when evaluating Gemini Pro vs Gemini Ultra plans.
