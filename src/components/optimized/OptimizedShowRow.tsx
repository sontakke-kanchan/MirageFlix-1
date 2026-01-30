/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import ShowCard from "../shared/ShowCard";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { tmdbConfig } from "../../config/tmdb";

type Show = {
  id: number;
  title: string;
  posterUrl: string | null;
  year?: number;
};

type Props = {
  query?: string;
};

export default function OptimizedShowRow({ query = "" }: Props) {
  const [allShows, setAllShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    console.count("[Optimized API Calls -> OptimizedShowRow] Fetching shows");

    fetch(
      `${tmdbConfig.baseUrl}/trending/movie/week?api_key=${tmdbConfig.apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped: Show[] = data.results.map((m: any) => ({
          id: m.id,
          title: m.title,
          posterUrl: m.poster_path
            ? `${tmdbConfig.imageBaseUrl}${m.poster_path}`
            : null,
          year: m.release_date
            ? new Date(m.release_date).getFullYear()
            : undefined,
        }));

        setAllShows(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredShows = useMemo(() => {
    console.log(
      "[OPTIMIZED] Filtering shows for debounced query:",
      debouncedQuery,
    );
    return allShows.filter((show) =>
      show.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [allShows, debouncedQuery]);

  if (loading) {
    return <Text c="dark.2">Loading…</Text>;
  }

  return (
    <Carousel
      slideSize="auto"
      slideGap="md"
      withControls
      controlSize={40}
      nextControlIcon={
        <IconChevronRight aria-label="Carousel Left" size={32} />
      }
      previousControlIcon={
        <IconChevronLeft aria-label="Carousel Right" size={32} />
      }
      styles={{
        controls: {
          top: "50%",
          transform: "translateY(-50%)",
          transition: "opacity 150ms ease",
          zIndex: 2,
        },

        control: {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          color: "#fff",

          "&:hover": {
            backgroundColor: "transparent",
            color: "#8A2BE2", // KS accent
          },
        },

        indicator: {
          display: "none",
        },
      }}
      className="group"
    >
      {filteredShows.map((show) => (
        <Carousel.Slide key={show.id}>
          <div style={{ width: 160 }}>
            <ShowCard
              title={show.title}
              year={show.year}
              posterUrl={show.posterUrl ?? undefined}
            />
          </div>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
