import Profile from "./Profile";
import styles from "./Navbar.module.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../contexts/AuthContext";
import { useLang } from "../../hook/useLang";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Navbar = () => {
  let navigate = useNavigate();
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const { dict } = useLang("nav");
  const pages = [
    // {
    //   name: '= Dashboard',
    //   link: '/'
    // },
    {
      name: "👋 " + dict.about,
      link: "/about",
    },
    {
      name: "🌳 " + dict.world,
      link: "/world",
    },
    {
      name: "👀 " + dict.notice,
      link: "/notice",
    },
  ];

  // console.log("pathname", pathname)
  const [anchorElNav, setAnchorElNav] = useState(null);
  const moveTo = (link) => {
    navigate(link);
    handleCloseNavMenu();
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <Offset />
      <AppBar color="primary" position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <Link
                to="/"
                className={pathname === "/" ? styles.Now : undefined}
              >
                🏠
              </Link>
            </Typography>

            {/* mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, i) => (
                  <MenuItem key={i} onClick={() => moveTo(page.link)}>
                    <Typography
                      textAlign="center"
                      sx={{
                        fontWeight: pathname === page.link ? "bold" : "",
                        opacity: pathname === page.link ? 1 : 0.8,
                      }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* mobile */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <Link
                to="/"
                className={pathname === "/" ? styles.Now : undefined}
              >
                🏠
              </Link>
            </Typography>

            {/* pc */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page, i) => (
                <Button
                  key={i}
                  onClick={() => moveTo(page.link)}
                  sx={{
                    color: "white",
                    display: "block",
                    fontWeight: pathname === page.link ? "bold" : "",
                    opacity: pathname === page.link ? 1 : 0.9,
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Profile currentUser={currentUser} />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
