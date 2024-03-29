import { Box, Button, createStyles, Overlay, Text, Title } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { getCookie, setCookies } from 'cookies-next';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundImage: 'url(https://i.imgur.com/7Kqp1x6.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
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

  hungry: {
    color: theme.colors.red[8],
  },

  nothungry: {
    color: theme.colors.green[8],
  },
}));

const formatTime = timeToken => timeToken ? [
  ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][timeToken - 2 >> 1],
  ['matin', 'soir'][timeToken % 2],
].join` ` : '?';

const getTimeToken = time => dayjs(time).day() * 2 + (12 <= dayjs(time).hour()) * 1 + 2;

export default function Index() {
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const [nextMealTime, setNextMealTime] = useState(dayjs(getCookie('nextMealTime') ?? dayjs()));
  const [viewportSize, setViewportSize] = useState({ height: 0, width: 0 });
  const [dogIsHungry, setDogIsHungry] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(dayjs());
  const [lastMealDay, setLastMealDay] = useState(formatTime(0));

  const feed = () => {
    const now = dayjs();
    const newNextMealTime = now.set('h', now.hour() < 12 ? 11 : 23).set('m', 59).set('s', 59);
    setNextMealTime(newNextMealTime);
    setCookies('nextMealTime', newNextMealTime.toJSON(), { expires: dayjs().add(30, 'd').toDate() });
  };

  const unfeed = () => {
    const newNextMealTime = dayjs().subtract(1, 'h');
    setNextMealTime(newNextMealTime);
    setCookies('nextMealTime', newNextMealTime.toJSON(), { expires: dayjs().add(30, 'd').toDate() });
  };

  const doUpdate = useCallback(() => {
    const now = dayjs();
    setDogIsHungry(nextMealTime.isBefore(now));
    setLastUpdate(now);
  }, [nextMealTime]);

  useEffect(() => setViewportSize({ width, height }), [height, width]);
  useEffect(() => setLastMealDay(formatTime(getTimeToken(nextMealTime))), [nextMealTime]);
  useEffect(() => {
    doUpdate();
    const interval = setInterval(doUpdate, 60000);
    return () => clearInterval(interval);
  }, [doUpdate]);

  return <>
    <div className={classes.wrapper} style={viewportSize}>
      <Overlay color="#000" opacity={0.65} zIndex={1} style={viewportSize} />
      <div className={classes.inner} style={viewportSize}>
        <Box style={{ height: viewportSize.height / 5 }} />
        <Box style={{ height: viewportSize.height / 5 }}>
          <Title className={classes.title}>
            <Text component="span" inherit className={dogIsHungry ? classes.hungry : classes.nothungry}>
              {dogIsHungry ? `Le chien n'a pas mangé !` : `Le chien a mangé ${lastMealDay}.`}
            </Text>
          </Title>
        </Box>
        <Box style={{ height: viewportSize.height / 5 }} />
        <Box style={{ margin: 'auto', textAlign: 'center' }}>
          {dogIsHungry ?
            <Button variant="white" size="xl" onClick={feed} px={100}>
              <Text size="xl">Nourrir le chien</Text>
            </Button>
            :
            <Button variant="outline" size="xl" onClick={unfeed} px={100}>
              <Text size="xl">En fait non</Text>
            </Button>}
        </Box>
        <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
          <Text>
            {lastUpdate.format('HH:mm')}
          </Text>
        </div>
        <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
          <Link href="https://github.com/jeanvalentin/dogfooder">
            <a>
              <svg height={32} viewBox="0 0 16 16" width={32}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </div>
  </>;
}
