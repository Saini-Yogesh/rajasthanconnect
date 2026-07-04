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

const FILTERS = ["All", "Fort", "Palace", "Temple", "Lake", "Museum", "Garden", "Desert"];

export default function PlacesList() {
  useSEO(LIST_SEO.places);

  const { data, loading } = useFetch("/api/places");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      const matchSearch = matchesSearch(
        search,
        item.title,
        item.description,
        item.city_id
      );
      const matchFilter =
        activeFilter === "All" ||
        String(item.category || "").toLowerCase() === activeFilter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [data, search, activeFilter]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Heritage Sites"
        title="Forts, Palaces & Sacred Places"
        subtitle="Over 400 forts and palaces stand across Rajasthan — more than any other state in India. Each one is a stone chronicle of valor, romance, and power."
      >
        <SearchFilterBar
          searchTerm={search}
          onSearch={setSearch}
          placeholder="Search forts, palaces, temples..."
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
            loadingMsg="Mapping the heritage sites..."
            emptyTitle="No places found"
            emptyMsg={`No places match "${search || activeFilter}".`}
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl || item.image_urls?.[0]}
                badge={item.category}
                title={item.title}
                subtitle={item.city_id}
                description={item.description}
                to={`/places/${item.id}`}
                linkText="Explore Place"
                tags={item.tags || []}
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
