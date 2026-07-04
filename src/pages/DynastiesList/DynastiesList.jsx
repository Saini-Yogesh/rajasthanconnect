import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import SectionHeader from "../../components/ui/SectionHeader/SectionHeader";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import "./DynastiesList.css";
import "../../styles/ListPage.css";

export default function DynastiesList() {
  useSEO(LIST_SEO.dynasties);

  const { data, loading } = useFetch("/api/dynasties");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.capital)
    );
  }, [data, search]);

  return (
    <div className="dynastiesPage">
      <PageHeader
        badge="Royal Clans"
        title="Royal Dynasties of Rajasthan"
        subtitle="For over 1,500 years, Rajput clans carved kingdoms from desert sands and rocky hills. Their legacy of valor, art, and architecture still stands."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search dynasties, clans, capitals..." />
      </PageHeader>

      <div className="pageContainer">
        {loading ? (
          <LoadingSpinner message="Unrolling the royal scrolls..." />
        ) : items.length === 0 ? (
          <EmptyState title="No dynasties found" message="Try a different search." />
        ) : (
          <>
            <SectionHeader title="Ruling Clans of Rajputana" subtitle={`${items.length} dynasties chronicled`} />
            <div className="dynastiesTimeline">
              {items.map((dynasty, idx) => (
                <div key={dynasty.id} className={`dynastyRow ${idx % 2 === 0 ? "dynastyRowLeft" : "dynastyRowRight"}`}>
                  <div className="dynastyCard">
                    <div className="dynastyCardEra">
                      {dynasty.period || dynasty.founded_year || "Ancient"}
                    </div>
                    <h3 className="dynastyName">{dynasty.name}</h3>
                    {dynasty.clan && <p className="dynastyClan">Clan: <strong>{dynasty.clan}</strong></p>}
                    {dynasty.capital && <p className="dynastyCapital">🏰 Capital: {dynasty.capital}</p>}
                    {dynasty.description && <p className="dynastyDesc">{dynasty.description}</p>}
                    <Link to={`/history-culture`} className="dynastyLink">
                      Explore History →
                    </Link>
                  </div>
                  <div className="dynastyTimelineNode" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
