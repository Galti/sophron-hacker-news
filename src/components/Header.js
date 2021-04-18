import {AppBar, Typography, Toolbar} from "@material-ui/core";

const Header = () => (
  <AppBar position="sticky">
    <Toolbar>
      <Typography variant="h6">Hacker News</Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
