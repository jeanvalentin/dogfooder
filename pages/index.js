import { Button, createStyles, Overlay, Text, Title } from '@mantine/core';
import { getCookie, setCookies } from 'cookies-next';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 130,
    paddingBottom: 130,
    backgroundImage:
      'url(https://dogfooder.surge.sh/chien.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    '@media (max-width: 520px)': {
      paddingTop: 80,
      paddingBottom: 50,
    },
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
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  controls: {
    marginTop: theme.spacing.xl * 1.5,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  control: {
    height: 42,
    fontSize: theme.fontSizes.md,

    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    '@media (max-width: 520px)': {
      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

const formatTime = time => {
  return time ? [
    ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][dayjs(time).day()],
    dayjs(time).hour() < 12 ? 'matin' : 'soir'
  ].join` ` : '?';
}

export default function Index() {
  const { classes, cx } = useStyles();
  const timeFromCookieTry = getCookie('time');
  const [time, setTime] = useState(timeFromCookieTry ? dayjs(timeFromCookieTry) : null);
  const [formattedTime, setFormattedTime] = useState('');

  const feed = () => {
    const now = dayjs();
    setTime(now);
    setCookies('time', now.toJSON(), { expires: now.add(30, 'd').toDate() });
  }

  useEffect(() => setFormattedTime(formatTime(time)), [time])

  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Le chien a mangé{' '}
          <Text component="span" inherit className={classes.highlight}>
            {formattedTime}
          </Text>
        </Title>

        <div className={classes.controls}>
          <Button className={classes.control} variant="white" size="xl" onClick={feed}>
            <Text size='xl'>
              Nourrir le chien
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
}
