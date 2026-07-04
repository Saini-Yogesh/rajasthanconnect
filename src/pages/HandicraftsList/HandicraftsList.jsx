import React, { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import InfiniteGrid from "../../components/ui/InfiniteGrid/InfiniteGrid";
import RajCard from "../../components/ui/RajCard/RajCard";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import { enrichHandicraft } from "../../utils/handicraftCategories";
import "./HandicraftsList.css";

const FILTERS = ["All", "Textile", "Pottery", "Jewellery", "Painting", "Metal", "Wood", "Stone", "Craft"];

export default function HandicraftsList() {
  useSEO(LIST_SEO.handicrafts);

  const { data, loading, error } = useFetch("/api/handicrafts");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map(enrichHandicraft)
      .filter((item) => {
        const matchSearch = matchesSearch(
          search,
          item.name,
          item.description,
          item.process_description,
          item.origin_city,
          item.origin_city_id,
          item.materials_used
        );
        const matchFilter =
          activeFilter === "All" ||
          item.category.toLowerCase() === activeFilter.toLowerCase();
        return matchSearch && matchFilter;
      });
  }, [data, search, activeFilter]);

  const emptyMsg =
    search.trim()
      ? `No handicrafts match "${search}". Try a different search.`
      : activeFilter !== "All"
        ? `No handicrafts in the "${activeFilter}" category yet. Try "All" or another filter.`
        : error
          ? "Could not load handicrafts. Please refresh the page."
          : "No handicrafts found.";

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Artisan Heritage"
        title="Handicrafts of Rajasthan"
        subtitle="500-year-old artisan traditions — blue pottery, block printing, Bandhani, and Meenakari — passed from master craftsmen to the next generation."
      >
        <SearchFilterBar
          searchTerm={search}
          onSearch={setSearch}
          placeholder="Search crafts, techniques, cities..."
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
            loadingMsg="Spinning the looms of heritage..."
            emptyTitle="No crafts found"
            emptyMsg={emptyMsg}
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.category}
                title={item.name}
                subtitle={item.origin_city}
                description={item.description}
                to={`/handicrafts/${item.id}`}
                linkText="View Craft"
                tags={item.tags || []}
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
