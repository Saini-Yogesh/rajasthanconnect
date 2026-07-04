import React, { useState, useCallback, useMemo, useEffect } from "react";
import EmptyState from "../EmptyState/EmptyState";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./InfiniteGrid.css";

const PAGE_SIZE = 12;

/**
 * Grid that renders items with "Load More" infinite scroll pattern.
 * All data is passed in — no network calls. Just progressive reveal.
 *
 * @param {any[]}    items        - Full filtered array
 * @param {function} renderItem   - (item, index) => ReactNode
 * @param {boolean}  loading
 * @param {string}   [loadingMsg]
 * @param {string}   [emptyTitle]
 * @param {string}   [emptyMsg]
 * @param {node}     [emptyAction]
 * @param {string}   [columns]    - "2" | "3" (default) | "4"
 */
export default function InfiniteGrid({
  items = [],
  renderItem,
  loading,
  loadingMsg,
  emptyTitle,
  emptyMsg,
  emptyAction,
  columns = "3",
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [items]);

  const uniqueItems = useMemo(() => {
    const seen = new Set();
    return items.filter((item) => {
      if (item?.id == null) return true;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [items]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  if (loading) {
    return <LoadingSpinner message={loadingMsg} />;
  }

  if (!uniqueItems.length) {
    return (
      <EmptyState
        title={emptyTitle || "Nothing to show here"}
        message={emptyMsg || "Try adjusting your filters or search term."}
        action={emptyAction}
      />
    );
  }

  const visible = uniqueItems.slice(0, visibleCount);
  const hasMore = visibleCount < uniqueItems.length;

  return (
    <div className="infiniteGrid">
      <div className={`infiniteGridItems infiniteGridItems--cols${columns}`}>
        {visible.map((item, idx) => (
          <div key={item.id ?? idx} className="infiniteGridItem">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="loadMoreWrapper">
          <button className="loadMoreBtn" onClick={loadMore}>
            Load More
            <span className="loadMoreCount">
              ({uniqueItems.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
