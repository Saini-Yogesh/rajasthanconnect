import React, { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import InfiniteGrid from "../../components/ui/InfiniteGrid/InfiniteGrid";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import "./HistoricalEventsList.css";
import "../../styles/ListPage.css";

export default function HistoricalEventsList() {
  useSEO(LIST_SEO.events);

  const { data, loading } = useFetch("/api/historical-events");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) =>
        matchesSearch(search, item.title, item.description, item.location)
      )
      .sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [data, search]);

  return (
    <div className="eventsPage">
      <PageHeader
        badge="Chronicles of Rajputana"
        title="Historical Events"
        subtitle="From the Battle of Haldighati to the founding of Jaipur — the milestones that shaped the Land of Kings across 1,500 years of history."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search events, battles, years..." />
      </PageHeader>

      <div className="pageContainer">
        <InfiniteGrid
          items={items}
          loading={loading}
          loadingMsg="Opening the royal chronicles..."
          emptyTitle="No events found"
          emptyMsg="Try a different search term."
          columns="2"
          renderItem={(event) => (
            <div className="eventCard">
              <div className="eventYear">
                {event.year ? `${event.year} AD` : event.period || "Ancient"}
              </div>
              <div className="eventCardContent">
                <span className="eventType">{event.type || event.category || "Event"}</span>
                <h3 className="eventTitle">{event.title}</h3>
                {event.location && (
                  <p className="eventLocation">📍 {event.location}</p>
                )}
                <p className="eventDesc">{event.description}</p>
                {event.significance && (
                  <p className="eventSignificance">
                    <strong>Significance:</strong> {event.significance}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
