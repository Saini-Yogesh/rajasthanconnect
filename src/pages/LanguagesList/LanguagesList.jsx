import React, { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/ui/PageHeader/PageHeader";
import SearchFilterBar from "../../components/ui/SearchFilterBar/SearchFilterBar";
import LoadingSpinner from "../../components/ui/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState/EmptyState";
import SectionHeader from "../../components/ui/SectionHeader/SectionHeader";
import useSEO from "../../hooks/useSEO";
import { LIST_SEO } from "../../utils/seo";
import { matchesSearch } from "../../utils/search";
import "./LanguagesList.css";
import "../../styles/ListPage.css";

export default function LanguagesList() {
  useSEO(LIST_SEO.languages);

  const { data, loading } = useFetch("/api/languages");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      matchesSearch(search, item.name, item.description, item.region)
    );
  }, [data, search]);

  return (
    <div className="languagesPage">
      <PageHeader
        badge="Linguistic Heritage"
        title="Languages of Rajasthan"
        subtitle="Rajasthan's linguistic diversity spans 22+ dialects across its deserts and hills — each carrying centuries of poetry, folklore, and wisdom."
      >
        <SearchFilterBar searchTerm={search} onSearch={setSearch} placeholder="Search languages, regions, dialects..." />
      </PageHeader>

      <div className="pageContainer">
        {loading ? (
          <LoadingSpinner message="Consulting the ancient scripts..." />
        ) : items.length === 0 ? (
          <EmptyState title="No languages found" message="Try a different search." />
        ) : (
          <>
            <SectionHeader title="Language & Dialect Map" subtitle={`${items.length} languages spoken across Rajasthan`} />
            <div className="languagesGrid">
              {items.map((lang) => (
                <div key={lang.id} className="languageCard">
                  <div className="langCardTop">
                    <div className="langScript">{lang.script || lang.name?.[0]}</div>
                    <div className="langInfo">
                      <h3 className="langName">{lang.name}</h3>
                      {lang.region && <p className="langRegion">📍 {lang.region}</p>}
                    </div>
                  </div>
                  {lang.description && <p className="langDesc">{lang.description}</p>}
                  {lang.speakers && (
                    <div className="langSpeakers">
                      <span>Speakers:</span> <strong>{lang.speakers}</strong>
                    </div>
                  )}
                  {lang.key_phrases && Array.isArray(lang.key_phrases) && (
                    <div className="langPhrases">
                      <p className="langPhrasesTitle">Common Phrases:</p>
                      {lang.key_phrases.slice(0, 3).map((phrase, i) => (
                        <span key={i} className="langPhrase">{phrase}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
