import styled from "styled-components";

const ControlContainer = styled.div`
  display: flex;
  margin: 0 15px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 474px;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 20px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  display: flex;
  width: 471px;
  height: 40px;
  padding: 8px 16px;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  border-radius: 81px;
  border: 1px solid #e8e8e8;
  background: #f5f5f5;
`;

export { ControlContainer, SearchContainer, IconWrapper, SearchInput };
