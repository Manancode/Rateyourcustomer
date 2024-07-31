import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';
import classes from './FeaturesCards.module.css';
import Image from 'next/image';

export const mockdata = [
  {
    title: 'Effortless Onboarding',
    description:
      'Get started quickly with our seamless onboarding process. Connect your existing database, and let our platform automatically fetch and analyze customer data. Experience hassle-free integration and immediate insights.',
    imageSrc: "/images/onboarding.png",
    imageAlt: "Effortless Onboarding",
  },
  {
    title: 'In-Depth Customer Insights',
    description:
      'Gain valuable insights into your customers with our advanced analytics. Understand their behavior, preferences, and engagement patterns. Use this data to make informed decisions and improve customer satisfaction.',
    imageSrc: "/images/insights.png",
    imageAlt: "In-Depth Customer Insights",
  },
  {
    title: 'Automated Customer Ratings',
    description:
      'Leverage our automated rating system to categorize your customers based on their activity and interactions. Our AI-driven algorithms ensure accurate and up-to-date ratings, helping you focus on your most valuable customers.',
    imageSrc: "/images/ratings.png",
    imageAlt: "Automated Customer Ratings",
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          use case
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        How It Works
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Discover how our platform can help you achieve your goals effortlessly.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
