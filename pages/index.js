import { Box, Button, createStyles, Grid, Overlay, Text, Title } from '@mantine/core';
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

const formatTime = timeToken => timeToken ? [
  ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][timeToken - 2 >> 1],
  ['matin', 'soir'][timeToken % 2]
].join` ` : '?';

const getTimeToken = time => dayjs(time).day() * 2 + (12 <= dayjs(time).hour()) * 1 + 2;

export default function Index() {
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const [timeToken, setTimeToken] = useState(getCookie('timeToken') ?? 0);
  const [formattedTime, setFormattedTime] = useState('');
  const [viewportSize, setViewportSize] = useState({ height: 0, width: 0 });

  const feed = () => {
    const newTimeToken = getTimeToken(dayjs());
    setTimeToken(newTimeToken);
    setCookies('timeToken', newTimeToken, { expires: dayjs().add(30, 'd').toDate() });
  }

  const unfeed = () => {
    const oldTimeToken = getTimeToken(dayjs().subtract(12, 'h'));
    setTimeToken(oldTimeToken);
    setCookies('timeToken', oldTimeToken, { expires: dayjs().add(30, 'd').toDate() });
  }

  useEffect(() => setFormattedTime(formatTime(timeToken)), [timeToken])
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
          <Grid gutter='xl' px='xl'>
            <Grid.Col span={6}>
              <Button variant="white" size="xl" onClick={feed} style={{ width: '100%' }}>
                <Text size='xl'>Nourrir le chien</Text>
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button variant="outline" size="xl" onClick={unfeed} style={{ width: '100%' }}>
                <Text size='xl'>En fait non</Text>
              </Button>
            </Grid.Col>
          </Grid>
        </Box>
      </div>
    </div>
  </>
}
