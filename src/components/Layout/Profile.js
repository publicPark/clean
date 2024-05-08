import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useLang } from "../../hook/useLang";
import { getLangObject } from "../../data/dictionaries/dictionary";

const Profile = () => {
  const { currentUser, googleAuth, userSignOut } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { darkTheme, toggleTheme, lang } = useTheme();
  const { dict } = useLang("profile");
  const langObj = getLangObject(lang);
  const handleGoogleAuth = (e) => {
    googleAuth();
    handleCloseUserMenu();
  };
  const handleSignOut = () => {
    userSignOut();
    handleCloseUserMenu();
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        {currentUser ? (
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={currentUser.displayName} src={currentUser.photoURL} />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            onClick={handleOpenUserMenu}
            color="secondary"
          >
            {dict.setting}
          </Button>
        )}
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {currentUser ? (
          [
            <Link to="/profile" key="profile">
              <MenuItem>
                <Typography textAlign="center">
                  {currentUser.displayName}
                </Typography>
              </MenuItem>
            </Link>,
            <MenuItem onClick={handleSignOut} key="logout">
              <Typography textAlign="center">{dict.logout}</Typography>
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleGoogleAuth}>
            <Typography textAlign="center">{dict.googleLogin}</Typography>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={toggleTheme}>
          <Typography textAlign="center">{darkTheme ? "🌜" : "🌻"}</Typography>
        </MenuItem>
        <Divider />
        <Link to="/lang" key="lang">
          <MenuItem>
            <Typography textAlign="center">{langObj.icon}</Typography>
          </MenuItem>
        </Link>
      </Menu>
    </Box>
  );
};

export default Profile;
