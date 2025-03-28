// src/pages/Subscription/index.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Group, Text, Button, Stack, Badge, Grid, Container, Title, List, ThemeIcon, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { subscribePaymentApi,handlePaymentCallbackApi } from '../../apis/payment';

const plans = {
  BASIC: {
    name: 'Basic',
    price: '250,000',
    duration: '1 month',
    messageLimit: '100,000',
    features: [
      'Upload up to 15MB per file',
      'Total storage: 10GB',
      'Basic chat support',
      '100k messages/month'
    ]
  },
  ADVANCED: {
    name: 'Advanced',
    price: '500,000',
    duration: '3 months',
    messageLimit: '300,000',
    features: [
      'Upload up to 30MB per file',
      'Total storage: 30GB',
      'Priority chat support',
      '300k messages/month',
      'Advanced analytics'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: '1,200,000',
    duration: '3 months',
    messageLimit: 'Unlimited',
    features: [
      'Upload up to 60MB per file',
      'Total storage: 50GB',
      'Priority support 24/7',
      'Unlimited messages',
      'Custom integration',
      'Advanced analytics',
      'API access'
    ]
  }
};

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderCode = searchParams.get('orderCode');
    const status = searchParams.get('status');

    if (orderCode && status) {
      handlePaymentCallback(orderCode, status);
    }
  }, [searchParams]);

  const handlePaymentCallback = async (orderCode, status) => {
    try {
      await handlePaymentCallbackApi({
        orderCode,
        status,
        onSuccess: (response) => {
          notifications.show({
            title: 'Success',
            message: 'Payment processed successfully',
            color: 'green',
            autoClose: 2000
          });
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        },
        onFail: (error) => {
          notifications.show({
            title: 'Error',
            message: error || 'Payment verification failed',
            color: 'red'
          });
          setTimeout(() => {
            navigate('/subscription');
          }, 1500);
        }
      });
    } catch (error) {
      console.error('Payment callback error:', error);
      notifications.show({
        title: 'Error',
        message: 'Payment verification failed',
        color: 'red'
      });
    }
  };

  const handleSubscribe = async (planType) => {
    setLoadingPlan(planType);
    try {
      const result = await subscribePaymentApi({
        plan: planType,
        onSuccess: (data) => {
          if (data?.payment_link) {
            notifications.show({
              title: 'Success',
              message: 'Redirecting to payment...',
              color: 'green',
              autoClose: 2000
            });
            setTimeout(() => {
              window.location.href = data.payment_link;
            }, 1500);
          } else {
            throw new Error('Invalid payment link received');
          }
        },
        onFail: (error) => {
          notifications.show({
            title: 'Error',
            message: error?.message || 'Payment initialization failed',
            color: 'red'
          });
        }
      });

      return result;
    } catch (error) {
      console.error('Subscription error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to process subscription. Please try again.',
        color: 'red'
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanColor = (type) => {
    switch (type) {
      case 'PREMIUM': return { color: 'violet', gradient: { from: 'violet', to: 'grape' } };
      case 'ADVANCED': return { color: 'blue', gradient: { from: 'blue', to: 'cyan' } };
      default: return { color: 'gray', gradient: { from: 'gray', to: 'gray.7' } };
    }
  };

  if (searchParams.get('orderCode') && searchParams.get('status')) {
    return (
      <Container size="sm" py="xl">
        <Stack align="center" spacing="md">
          <LoadingOverlay visible={true} />
          <Title order={3}>Verifying payment...</Title>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={2} align="center" mb="xl">Choose Your Plan</Title>
        
        <Grid gutter="lg">
          {Object.entries(plans).map(([type, plan]) => {
            const { color, gradient } = getPlanColor(type);
            return (
              <Grid.Col key={type} span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow="sm" p="lg" radius="md" withBorder pos="relative">
                  <LoadingOverlay visible={loadingPlan === type} overlayBlur={2} />
                  <Stack spacing="md">
                    <Group position="apart">
                      <Title order={3}>{plan.name}</Title>
                      <Badge size="lg" variant="filled" color={color}>
                        {plan.duration}
                      </Badge>
                    </Group>

                    <Text size="xl" weight={700} align="center">
                      {plan.price} VND
                      <Text size="sm" color="dimmed" weight={400}>
                        /{plan.duration}
                      </Text>
                    </Text>

                    <List
                      spacing="sm"
                      size="sm"
                      center
                      icon={
                        <ThemeIcon color={color} size={20} radius="xl">
                          <IconCheck size={12} stroke={3} />
                        </ThemeIcon>
                      }
                    >
                      {plan.features.map((feature, index) => (
                        <List.Item key={index}>
                          {feature}
                        </List.Item>
                      ))}
                    </List>

                    <Button
                      variant="gradient"
                      gradient={gradient}
                      fullWidth
                      onClick={() => handleSubscribe(type)}
                      loading={loadingPlan === type}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === type ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
}