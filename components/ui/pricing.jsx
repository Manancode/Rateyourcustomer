import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  Button,
  Container,
} from '@mantine/core';
import classes from './Pricing.module.css';

const pricingData = [
  {
    title: 'FREE',
    price: '$0',
    period: '/month',
    features: [
      { text: 'Creates 1 Video', checked: true },
      { text: '1 Series', checked: true },
      { text: 'Edit & Preview Videos', checked: true },
      { text: 'Auto-Post To Channel', checked: false },
      { text: 'HD Video Resolution', checked: false },
      { text: 'Background Music', checked: false },
      { text: 'No Watermark', checked: false },
    ],
    buttonLabel: 'TRY NOW!',
  },
  {
    title: 'STARTER',
    price: '$19',
    period: '/month',
    features: [
      { text: 'Posts 3 Times A Week', checked: true },
      { text: '1 Series', checked: true },
      { text: 'Edit & Preview Videos', checked: true },
      { text: 'Auto-Post To Channel', checked: true },
      { text: 'HD Video Resolution', checked: true },
      { text: 'Background Music', checked: true },
      { text: 'No Watermark', checked: true },
    ],
    buttonLabel: 'TRY NOW!',
  },
  {
    title: 'DAILY',
    price: '$39',
    period: '/month',
    features: [
      { text: 'Posts Once A Day', checked: true },
      { text: '1 Series', checked: true },
      { text: 'Edit & Preview Videos', checked: true },
      { text: 'Auto-Post To Channel', checked: true },
      { text: 'HD Video Resolution', checked: true },
      { text: 'Background Music', checked: true },
      { text: 'No Watermark', checked: true },
    ],
    buttonLabel: 'TRY NOW!',
  },
  {
    title: 'HARDCORE',
    price: '$69',
    period: '/month',
    features: [
      { text: 'Posts Twice A Day', checked: true },
      { text: '1 Series', checked: true },
      { text: 'Edit & Preview Videos', checked: true },
      { text: 'Auto-Post To Channel', checked: true },
      { text: 'HD Video Resolution', checked: true },
      { text: 'Background Music', checked: true },
      { text: 'No Watermark', checked: true },
    ],
    buttonLabel: 'TRY NOW!',
  },
];

export function PricingPlans() {
  return (
    <Container size="lg" className={classes.container}>
      <Group justify="center">
        <Badge variant="filled" size="lg">
          PRICING
        </Badge>
      </Group>

      <Title order={2} className={classes.header}>
        PAY FOR WHAT YOU NEED
      </Title>

      <div className={classes.plans}>
        {pricingData.map((plan) => (
          <Card key={plan.title} className={classes.card}>
            <Text className={classes.cardTitle}>{plan.title}</Text>
            <Text className={classes.cardPrice}>
              {plan.price}
              <span>{plan.period}</span>
            </Text>
            <ul className={classes.cardFeatures}>
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className={
                    feature.checked
                      ? classes.checked
                      : classes.unchecked
                  }
                >
                  {feature.text}
                </li>
              ))}
            </ul>
            <Button className={classes.cardButton}>
              {plan.buttonLabel}
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
