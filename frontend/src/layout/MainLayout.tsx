import * as React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";

interface IMainLayoutProps {}

const MainLayout: React.FunctionComponent<IMainLayoutProps> = () => {
  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(135deg, #ffffff, #e6e6e6);",
      }}
    >
      <Container
        component="main"
        sx={{
          height: "100vh",
          paddingTop: "10px",
          overflowY: "auto",
        }}
        maxWidth="lg"
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
