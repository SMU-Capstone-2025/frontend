import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const ProjectContainer = styled.div`
  background-color: #f5f5f5;
  height: 100vh;
`;
export const NavBar = styled.div`
  background-color: #fff;
  height: 72px;
`;
export const TabsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 32px;
  margin-left: 32px;
`;
export const TabLink = styled(NavLink)`
  gap: 6px;
  display: flex;
  align-items: center;
  padding: 20px 0;
  font-size: 20px;
  font-weight: 600;
  opacity: 0.2;
  font-style: normal;
  line-height: normal;
  text-decoration: none;
  cursor: pointer;
  color: black;

  &.active {
    opacity: 1;
    border-bottom: 3px solid black;
  }
`;
