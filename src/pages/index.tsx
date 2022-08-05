import { useEffect } from 'react';

import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  async function fetchData({ pageParam = null }): Promise<any> {
    try {
      const result = await api.get('api/images', {
        params: { after: pageParam },
      });
      console.log('result', result);
      return result;
    } catch (err) {
      console.log('Error', err);
      return null;
    }
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchData, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage;
    },
  });

  const formattedData = useMemo(() => {
    // data.map((data) => )
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {/* <CardList cards={formattedData} /> */}
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
