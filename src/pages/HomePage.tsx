import { useState } from "react";
import { AppShell, Container, Stack, Title } from "@mantine/core";
import AppHeader from "../components/shared/Header";
import HeroBanner from "../components/shared/HeroBanner";
import { performanceConfig } from "../config/performance";
import SlowShowRow from "../components/slow/SlowShowRow";
import OptimizedShowRow from "../components/optimized/OptimizedShowRow";

export default function HomePage() {
  const [query, setQuery] = useState("");

  const ShowRowComponent =
    performanceConfig.mode === "slow" ? SlowShowRow : OptimizedShowRow;
  return (
    <AppShell header={{ height: 64 }} padding={0}>
      <AppShell.Header className="border-b border-white/5 bg-black/80 backdrop-blur">
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main className="bg-black min-h-screen">
        <Container size="xl">
          <Stack gap="xl" justify="center">
            {/* Hero */}
            <section aria-labelledby="hero-title">
              <HeroBanner
                title="Anaconda"
                tagline="A group of friends facing mid-life crises head to the rainforest, only to find themselves in a fight for their lives."
                searchQuery={query}
                onSearchChange={setQuery}
                backdropUrl="https://image.tmdb.org/t/p/original/swxhEJsAWms6X1fDZ4HdbvYBSf9.jpg"
              />
            </section>

            {/* Rows */}
            <section aria-labelledby="trending-title">
              <Title id="trending-title" order={2} size="h4" aria-description="Trending Now Shows" my="sm">
                Trending Now
              </Title>
              <ShowRowComponent query={query} />
            </section>

            <section aria-labelledby="trending-title">
              <Title id="trending-title" order={2} size="h4" aria-description="Popular Shows" my="sm">
                Popular
              </Title>
              <ShowRowComponent />
            </section>

            <section aria-labelledby="trending-title">
              <Title id="trending-title" order={2} size="h4" aria-description="Recommended Shows" my="sm">
                Recommended
              </Title>
              <ShowRowComponent />
            </section>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
