import {CircularProgress, Box} from "@material-ui/core";

const LazyLoading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    p={10}
  >
    <CircularProgress/>
  </Box>
);


export default LazyLoading;