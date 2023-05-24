export default async function mapAsyncWithConcurrency<T, U>(
    values: T[],
    asyncFn: (value: T) => Promise<U>,
    concurrencyLimit: number
  ): Promise<U[]> {
    const results: U[] = [];
    const pendingPromises: Promise<void>[] = [];

    async function processValue(value: T) {
        const result = await asyncFn(value);
        results.push(result);
    }

    for (const value of values) {
        const promise = processValue(value);
        pendingPromises.push(promise);

        if (pendingPromises.length >= concurrencyLimit) {
            await Promise.race(pendingPromises);
        }
    }

    await Promise.all(pendingPromises);

    return results;
}