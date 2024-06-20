import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Link,
  VStack,
  Input,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, SunIcon, MoonIcon } from 'react-icons/all';

const fetchTopStories = async () => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  const storyIds = await response.json();
  const top5Ids = storyIds.slice(0, 5);
  const storyPromises = top5Ids.map(async (id) => {
    const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return storyResponse.json();
  });
  return Promise.all(storyPromises);
};

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');

  useEffect(() => {
    fetchTopStories().then(setStories);
  }, []);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ChakraProvider>
      <Box bg={bgColor} color={color} minH="100vh" p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Heading>Hacker News Top Stories</Heading>
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            aria-label="Toggle Dark Mode"
          />
        </Box>
        <Box mb={4}>
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={2}
          />
          <IconButton icon={<SearchIcon />} aria-label="Search" />
        </Box>
        <VStack spacing={4} align="stretch">
          {filteredStories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md">{story.title}</Heading>
              <Text>Upvotes: {story.score}</Text>
              <Link href={story.url} color="teal.500" isExternal>
                Read more
              </Link>
            </Box>
          ))}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Index;