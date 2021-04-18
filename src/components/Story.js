import {
  Avatar,
  Container,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Link,
} from "@material-ui/core";
import {
  Favorite as FavoriteIcon,
  Launch as LaunchIcon,
} from "@material-ui/icons";

import moment from "moment";

const Story = ({story, onHeartClick}) => (
  <Container maxWidth="sm" style={{marginTop: "30px"}}>
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe">{story.author[0].toUpperCase()}</Avatar>
        }
        action={
          <IconButton aria-label="settings" target="_blank" href={story.url}>
            <LaunchIcon/>
          </IconButton>
        }
        title={story.author}
        subheader={moment.unix(story.creationTime).fromNow()}
      />
      <CardContent>
        <Typography variant="h6" color="textSecondary">
          {story.title}
          <Link href={story.url} onClick={(event) => event.preventDefault()}>
            ({new URL(story.url).hostname})
          </Link>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {story.score} votes
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => onHeartClick(story)}
        >
          {story.isFavorite ? (
            <FavoriteIcon color="secondary"/>
          ) : (
            <FavoriteIcon/>
          )}
        </IconButton>

      </CardActions>
    </Card>
  </Container>
);

export default Story;
