import React, { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import InfiniteGrid from "../../components/ui/InfiniteGrid/InfiniteGrid";
import RajCard from "../../components/ui/RajCard/RajCard";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import "../HandicraftsList/HandicraftsList.css";

export default function RoyalWeddingsList() {
  useSEO(LIST_SEO.royalWeddings);

  const { data, loading } = useFetch("/api/royal-wedding-venues");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.city)
    );
  }, [data, search]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Destination Weddings"
        title="Royal Wedding Venues"
        subtitle="Rajasthan is the world's most sought-after destination for royal weddings. Floating palaces, ancient forts, and candlelit courtyards await your most important day."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search venues, palaces, cities..." />
      </PageHeader>
      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Preparing the royal mandap..."
            emptyTitle="No venues found"
            emptyMsg="Try a different search term."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.city}
                title={item.name}
                subtitle={item.city}
                description={item.description}
                to={`/royal-weddings/${item.id}`}
                linkText="View Venue"
                tags={item.features || []}
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
