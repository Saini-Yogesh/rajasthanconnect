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

export default function FolkMusicList() {
  useSEO(LIST_SEO.folkMusic);

  const { data, loading } = useFetch("/api/folk-music-instruments");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.type)
    );
  }, [data, search]);

  return (
    <div className="handicraftsPage">
      <PageHeader
        badge="Desert Melodies"
        title="Folk Music & Instruments"
        subtitle="The Manganiyar and Langa musicians have performed for royalty for 800 years — and today at Carnegie Hall. Explore Rajasthan's soul-stirring musical heritage."
      >
        <SearchFilterBar
          searchTerm={search}
          onSearch={setSearch}
          placeholder="Search instruments, musicians, traditions..."
        />
      </PageHeader>
      <section className="handicraftsGrid">
        <div className="pageContainer">
          <InfiniteGrid
            items={items}
            loading={loading}
            loadingMsg="Tuning the Khamaycha strings..."
            emptyTitle="No music found"
            emptyMsg="Try a different search term."
            columns="3"
            renderItem={(item) => (
              <RajCard
                image={item.image_url || item.imageUrl}
                badge={item.type || item.category}
                title={item.name}
                subtitle={item.region || item.community}
                description={item.description}
                to={`/folk-music/${item.id}`}
                linkText="Explore Music"
              />
            )}
          />
        </div>
      </section>
    </div>
  );
}
