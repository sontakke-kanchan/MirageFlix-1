import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import ShowRow from "../shared/ShowRow";
import ShowCard from "../shared/ShowCard";
import { tmdbConfig } from "../../config/tmdb";

type Show = {
  id: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  year?: number;
};

type Props = {
  query?: string;
};

export default function SlowShowRow({ query = "" }: Props) {
  const [allShows, setAllShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.count("[Slow API Calls -> SlowShowRow] Fetching shows");

    fetch(
      `${tmdbConfig.baseUrl}/trending/movie/week?api_key=${tmdbConfig.apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Show[] = data.results.map((m: any) => ({
          id: m.id,
          title: m.title,
          posterUrl: m.poster_path
            ? `${tmdbConfig.imageBaseUrl}${m.poster_path}`
            : null,
          backdropUrl: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : null,
          year: m.release_date
            ? new Date(m.release_date).getFullYear()
            : undefined,
        }));

        const inflated = Array.from({ length: 100 }).flatMap((_, index) =>
          mapped.map((item) => ({
            ...item,
            id: item.id * 250 + index,
          })),
        );

        setAllShows(inflated);
        setLoading(false);
      });
  }, []);

  console.log("[SLOW] Filtering shows for query:", query);
  // Still inefficient: filter on every render
  const filteredShows = allShows.filter((show) =>
    show.title.toLowerCase().includes(query.toLowerCase()),
  );

  if (loading) {
    return <Text c="dark.2">Loading…</Text>;
  }

  return (
    <ShowRow>
      {filteredShows.map((show) => (
        <ShowCard
          key={show.id}
          title={show.title}
          year={show.year}
          posterUrl={show.posterUrl ?? undefined}
        />
      ))}
    </ShowRow>
  );
}
