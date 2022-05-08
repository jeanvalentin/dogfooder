import { Box, Button, createStyles, Overlay, Text, Title } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { getCookie, setCookies } from 'cookies-next';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundImage: 'url(https://dogfooder.surge.sh/chien.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },
}));

const formatTime = time => {
  return time ? [
    ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][dayjs(time).day()],
    dayjs(time).hour() < 12 ? 'matin' : 'soir'
  ].join` ` : '?';
}

export default function Index() {
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const timeFromCookieTry = getCookie('time');
  const [time, setTime] = useState(timeFromCookieTry ? dayjs(timeFromCookieTry) : null);
  const [formattedTime, setFormattedTime] = useState('');
  const [viewportSize, setViewportSize] = useState({ height: 0, width: 0 });

  const feed = () => {
    const now = dayjs();
    setTime(now);
    setCookies('time', now.toJSON(), { expires: now.add(30, 'd').toDate() });
  }

  useEffect(() => setFormattedTime(formatTime(time)), [time])
  useEffect(() => setViewportSize({ width, height }), [height, width])

  return <>
    <div className={classes.wrapper} style={{ height: viewportSize.height, width: viewportSize.width, overflow: 'hidden' }}>
      <Overlay color="#000" opacity={0.65} zIndex={1} style={{ height: viewportSize.height, width: viewportSize.width }} />
      <div className={classes.inner}>
        <Box style={{ height: viewportSize.height / 5 }} />
        <Box style={{ height: viewportSize.height / 5 }}>
          <Title className={classes.title}>
            Le chien a mangé{' '}
            <Text component="span" inherit className={classes.highlight}>
              {formattedTime}
            </Text>
          </Title>
        </Box>
        <Box style={{ height: viewportSize.height / 5 }} />
        <Box style={{ margin: 'auto', textAlign: 'center' }}>
          <Button variant="white" size="xl" onClick={feed} px={100}>
            <Text size='xl'>
              Nourrir le chien
            </Text>
          </Button>
        </Box>
      </div>
    </div>
  </>
}
