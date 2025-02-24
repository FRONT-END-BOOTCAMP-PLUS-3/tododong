export async function fetcher<T>(
  url: string,
  options?: RequestInit,
  setIsLoading?: (nextIsLoading: boolean) => void
): Promise<T> {
  try {
    setIsLoading?.(true);

    const res = await fetch(url, options);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  } finally {
    setIsLoading?.(false);
  }
}
