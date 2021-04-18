import axios from "axios";
import {BASE_URL, STORIES_URL} from "../constants/constants";
import StoryModel from "../models/storyModel";

const instance = axios.create({
  baseURL: BASE_URL,
});

export const getStoryIds = async () => {
  try {
    const {data: storyIds} = await instance.get(STORIES_URL);

    return storyIds;
  } catch (e) {
    console.log(e.message);
  }
};

export const getStory = async (id) => {
  try {
    const {data: story} = await instance.get(`item/${id}.json`);
    return new StoryModel(story);
  } catch (error) {
    console.log("Error while getting a story.");
  }
};

export const getNewStories = async (storyIds) => {
  try {
    const stories = await Promise.all(storyIds.map((id) => getStory(id)));
    return stories;
  } catch (error) {
    console.log("Error while getting stories.");
  }
};
