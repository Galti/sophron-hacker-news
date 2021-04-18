import React, {useState, useEffect, useCallback} from "react";
import {
  Container,
  CssBaseline,
  Snackbar,
  Button,
  IconButton,
} from "@material-ui/core";
import {Close as CloseIcon} from "@material-ui/icons";
import {getStoryIds, getNewStories} from "../services/hackerNewsApi";
import Story from "../components/Story";
import PageLoading from "../components/PageLoading";
import useInterval from "../hooks/useInterval";
import LazyLoading from "../components/LazyLoading";

const bulkSize = 20;

const HomePage = () => {
  const [storyIds, setStoryIds] = useState([]);
  const [newStoryIds, setNewStoryIds] = useState([]);
  const [stories, setStories] = useState([]);
  const [bulkFactor, setBulkFactor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLazily, setIsLoadingLazily] = useState(false);
  const [shouldRecommendNews, setShouldRecommendNews] = useState(false);

  const initialize = async () => {
    const ids = await getStoryIds();
    const stories = await getNewStories(ids.slice(bulkFactor * bulkSize, (bulkFactor + 1) * bulkSize));

    setStories(stories);
    setStoryIds(ids);
    setIsLoading(false);
  };

  const handleHeartClick = (story) => {
    const favorites = [];
    const otherSTories = [];
    stories.forEach((s) => {
      if (s.id === story.id) {
        s.isFavorite = !s.isFavorite;
      }

      if (s.isFavorite) {
        favorites.push(s);
      } else {
        otherSTories.push(s);
      }
    });

    favorites.sort((s1, s2) => s2.creationTime - s1.creationTime);
    otherSTories.sort((s1, s2) => s2.creationTime - s1.creationTime);

    setStories([...favorites, ...otherSTories]);
  };

  const recommendNewsUpdate = () => setShouldRecommendNews(true);

  const handleCloseSnackBar = () => setShouldRecommendNews(false);

  const updateStories = async () => {
    handleCloseSnackBar();
    setStoryIds([...newStoryIds, ...storyIds].slice(0, 499));
    setNewStoryIds([]);
    const newStoriesFromAPI = await getNewStories(newStoryIds);

    const newStories = [];
    stories.some((s, i) => {
      if (s.isFavorite) {
        newStories.push(s);

        return false;
      }

      newStories.push(...newStoriesFromAPI);
      newStories.push(...stories.slice(i, stories.length));

      return true;
    });

    setStories(newStories);
  }

  const checkNewStories = async () => {
    const latestIds = await getStoryIds();
    const ids = [];

    latestIds.some((id) => {
      if (storyIds.includes(id))
        return true;

      ids.push(id);
      return false;
    });

    if (ids.length > newStoryIds.length) {
      setNewStoryIds(ids);
    }

  };

  const handleScroll = useCallback(() => {
    if (isLoadingLazily) return;

    const scrollTop = (document.documentElement
      && document.documentElement.scrollTop)
      || document.body.scrollTop;
    const scrollHeight = (document.documentElement
      && document.documentElement.scrollHeight)
      || document.body.scrollHeight;


    if ((scrollTop + window.innerHeight + 1000 >= scrollHeight) && (bulkFactor < 24)) {
      setIsLoadingLazily(true);
      setBulkFactor(bulkFactor + 1);
    }
  }, [isLoadingLazily])

  useEffect(() => initialize(), []);

  useEffect(() => {
    getNewStories(
      storyIds.slice(bulkFactor * bulkSize, (bulkFactor + 1) * bulkSize)
    ).then((data) => {
      setIsLoading(false);
      setStories([...stories, ...data]);
      setIsLoadingLazily(false);
    });
  }, [bulkFactor]);

  useEffect(() => {
    if (newStoryIds.length > 0) {
      recommendNewsUpdate();
    }
  }, [newStoryIds]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useInterval(checkNewStories, 10000);

  return (
    <div>
      <CssBaseline/>
      <Container maxWidth="lg">
        {isLoading ? (
          <PageLoading/>
        ) : (
          stories.map((s, i) => (
            <Story
              story={s}
              onHeartClick={handleHeartClick}
              key={s.author + i}
            />
          ))
        )}
        {isLoadingLazily ? <LazyLoading/> : (bulkFactor === 24 ? <p>End</p> : undefined)}

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={shouldRecommendNews}
          autoHideDuration={5000}
          onClose={handleCloseSnackBar}
          message={`New news (${newStoryIds.length})`}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={updateStories}>
                SHOW
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackBar}
              >
                <CloseIcon fontSize="small"/>
              </IconButton>
            </React.Fragment>
          }
        />
      </Container>
    </div>
  );
};

export default HomePage;
