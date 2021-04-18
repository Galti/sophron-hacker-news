import React, {useState, useEffect, useCallback} from "react";
import {
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

const chunkSize = 20;

const HomePage = () => {
  const [storyIds, setStoryIds] = useState([]);
  const [comingStoryIds, setComingStoryIds] = useState([]);
  const [stories, setStories] = useState([]);
  const [chunkFactor, setChunkFactor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLazily, setIsLoadingLazily] = useState(false);
  const [shouldRecommendNews, setShouldRecommendNews] = useState(false);

  const initialize = async () => {
    const ids = await getStoryIds();
    const stories = await getNewStories(ids.slice(chunkFactor * chunkSize, (chunkFactor + 1) * chunkSize));

    setStories(stories);
    setStoryIds(ids);
    setIsLoading(false);
  };


  const updateStories = async () => {
    handleCloseSnackBar();
    setStoryIds([...comingStoryIds, ...storyIds].slice(0, 499)); // Keep news maximum size to 500.

    const newStoriesFromAPI = await getNewStories(comingStoryIds);
    const newStories = [];

    // Add news stories after the favorites.
    stories.some((s, i) => {
      if (s.isFavorite) {
        newStories.push(s);
        return false;
      }

      newStories.push(...newStoriesFromAPI);
      newStories.push(...stories.slice(i, stories.length));

      return true;
    });

    setComingStoryIds([]); // Clear fetched ids: reset container.
    setStories(newStories);
  }

  const checkNewStories = async () => {
    const latestIds = await getStoryIds();
    const ids = [];

    // Check if there is a new story id in latest fetched ids.
    latestIds.some((id) => {
      if (storyIds.includes(id))
        return true;

      ids.push(id);
      return false;
    });

    if (ids.length > comingStoryIds.length) {
      setComingStoryIds(ids);
    }
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

  const handleOpenSnackBar = () => setShouldRecommendNews(true);

  const handleCloseSnackBar = () => setShouldRecommendNews(false);

  const handleScrollChange = useCallback(() => {
    if (isLoadingLazily) return;

    const scrollTop = (document.documentElement
      && document.documentElement.scrollTop)
      || document.body.scrollTop;
    const scrollHeight = (document.documentElement
      && document.documentElement.scrollHeight)
      || document.body.scrollHeight;

    if ((scrollTop + window.innerHeight + 1000 >= scrollHeight) && (chunkFactor < 24)) {
      setIsLoadingLazily(true);
      setChunkFactor(chunkFactor + 1);
    }
  }, [isLoadingLazily, chunkFactor])

  useEffect(() => {
    initialize()
  }, []);

  useEffect(() => {
    if(chunkFactor > 0) {
      getNewStories(
        storyIds.slice(chunkFactor * chunkSize, (chunkFactor + 1) * chunkSize)
      ).then((data) => {
        setStories([...stories, ...data]);
        setIsLoadingLazily(false);
      });
    }
  }, [chunkFactor]);

  useEffect(() => {
    if (comingStoryIds.length > 0) {
      handleOpenSnackBar();
    }
  }, [comingStoryIds]);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, [handleScrollChange]);

  useInterval(checkNewStories, 20000);

  return (
    <div>
      <CssBaseline/>
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
      {isLoadingLazily ? <LazyLoading/> : (chunkFactor === 24 ? <p>End</p> : undefined)}

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={shouldRecommendNews}
        message={`New news (${comingStoryIds.length})`}
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
    </div>
  );
};

export default HomePage;
