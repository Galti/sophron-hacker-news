import {CircularProgress, Box, Typography} from "@material-ui/core";

const PageLoading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="calc(100vh - 64px)" // Minus the height of the header.
  >
    <CircularProgress/>
    <Box p={2}>
      <Typography variant="h6" color="textSecondary">
        Getting News...
      </Typography>
    </Box>
  </Box>
);

export default PageLoading;
