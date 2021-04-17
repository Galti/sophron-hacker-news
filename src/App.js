import logo from "./logo.svg";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import { Book } from "@material-ui/icons";
import { green } from "@material-ui/core/colors";
import SvgIcon from "@material-ui/core/SvgIcon";
import Icon from "@material-ui/core/Icon";

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Typography variant="h4" gutterBottom>
          Testing Roboto Font.
        </Typography>
        <HomeIcon color="primary" />
        <HomeIcon style={{ color: green[500] }} fontSize="large" />
        <Icon style={{ fontSize: 30 }}>add_circle</Icon>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          <Book />
        </a>
      </header>
    </div>
  );
}

export default App;
