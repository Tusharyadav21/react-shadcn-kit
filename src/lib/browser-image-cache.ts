const inFlightRequests = new Map<string, Promise<Blob>>();

export async function getCachedImage(
	cacheName: string,
	imageUrl: string
): Promise<Blob> {
	const cache = await caches.open(cacheName);

	// 1. Check Cache
	const cachedResponse = await cache.match(imageUrl);
	if (cachedResponse) {
		return await cachedResponse.blob();
	}

	// 2. Check for in-flight requests to deduplicate
	if (inFlightRequests.has(imageUrl)) {
		return inFlightRequests.get(imageUrl)!;
	}

	// 3. Fetch and Cache
	const fetchPromise = (async () => {
		try {
			const response = await fetch(imageUrl, {
				cache: "no-store",
			});

			if (!response.ok) {
				throw new Error(
					`Image fetch failed: ${response.statusText}`
				);
			}

			// Store in cache
			await cache.put(imageUrl, response.clone());
			return await response.blob();
		} finally {
			// Clean up in-flight map
			inFlightRequests.delete(imageUrl);
		}
	})();

	inFlightRequests.set(imageUrl, fetchPromise);
	return fetchPromise;
}
