import { useEffect } from 'react';

import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery, useMutation } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface IDataImages {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface IFetchImagesResponse {
  data: IDataImages[];
  after: string | null;
}

export default function Home(): JSX.Element {
  async function fetchImages({
    pageParam = null,
  }): Promise<IFetchImagesResponse> {
    const { data } = await api.get('/api/images', {
      params: { after: pageParam },
    });
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => {
      return lastPage.after ? lastPage.after : null;
    },
  });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(i => i.data.flat());
    console.log(formatted);
    return formatted;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {formattedData.length > 0 ||
          (hasNextPage && (
            <Button
              bg="orange.500"
              color="pGray.50"
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          ))}
      </Box>
    </>
  );
}
