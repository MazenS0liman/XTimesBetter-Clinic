import * as React from 'react';

// Styles
import styles from './responsiveSideBar.module.css';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DehazeIcon from '@mui/icons-material/Dehaze';

export const ResponsiveSideBar = ({ array }) => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ 
        width: "50%",
        display: {
            xs: 'none',
            md: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List >
        {array.map((element, index) => (
          <ListItem key={element.pageName} disablePadding>
            <ListItemButton  component="a" href={`${element.url}`} >
              <ListItemIcon  sx={{width: "20%"}}>
                <ArrowForwardIosIcon />
              </ListItemIcon>
              <ListItemText primary={element.pageName}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className={styles['sidebar-main-div']}>
        <React.Fragment key={"left"}>
          <Button sx={{color: "black"}} className={styles['view-button']} onClick={toggleDrawer("left", true)}>
            <DehazeIcon></DehazeIcon>
          </Button>
          <Drawer
            PaperProps={{
                sx: { width: "250px" },
                }}
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}

          >
            {list("left")}
          </Drawer>
        </React.Fragment>   
    </div>
  );
}
