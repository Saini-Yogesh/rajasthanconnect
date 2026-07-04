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

const FILTERS = ["All", "Dance", "Music", "Theatre", "Painting", "Craft"];

export default function FolkArtsList() {
  useSEO(LIST_SEO.folkArts);

  const { data, loading } = useFetch("/api/folk-arts");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      const matchSearch = matchesSearch(search, item.name, item.description);
      const matchFilter =
        activeFilter === "All" ||
        String(item.category || "").toLowerCase() === activeFilter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [data, search, activeFilter]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Living Heritage"
        title="Folk Arts of Rajasthan"
        subtitle="From the swirling skirts of Ghoomar to the ancient Kathputli string puppets — Rajasthan's folk arts have been alive for over a thousand years."
      >
        <SearchFilterBar
          searchTerm={search}
          onSearch={setSearch}
          placeholder="Search folk arts, dance, music..."
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </PageHeader>

      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Summoning the folk performers..."
            emptyTitle="No folk arts found"
            emptyMsg="Try a different search or filter."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.category}
                title={item.name}
                subtitle={item.region || item.origin}
                description={item.description}
                to={`/folk-arts/${item.id}`}
                linkText="Explore Art Form"
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
