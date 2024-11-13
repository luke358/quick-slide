import { QueryClient } from '@tanstack/react-query'
const defaultStaleTime = 600_000 // 10min
// const DO_NOT_RETRY_CODES = new Set([400, 401, 403, 404, 422])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1000,
      staleTime: defaultStaleTime,
      retry(failureCount, _error) {
        // if (
        //   error instanceof Response &&
        //   (error.statusCode === undefined || DO_NOT_RETRY_CODES.has(error.statusCode))
        // ) {
        //   return false
        // }
        return !!(3 - failureCount)
      },
      // throwOnError: import.meta.env.DEV,
    },
  },
})
export { queryClient }
