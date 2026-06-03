import { useEffect } from 'react';

export default function useInfiniteScroll({ sentinelRef, onLoadMore, loading, hasMore }) {
  useEffect(() => {
    if (loading || !hasMore || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef, onLoadMore, loading, hasMore]);
}
