import styled from "styled-components";

export const TaskContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  min-width: 120px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 15px;
  background-color: ${(props) => props.$bgColor};
  box-shadow: 0px 2px 9.4px 0px rgba(0, 0, 0, 0.08);
`;
export const ColumnContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex-shrink: 0;
`;

export const ColumnHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 34px;
`;

export const TaskStatus = styled.div`
  display: flex;
  height: 34px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 10px;
  background-color: #fff;
  padding: 8px 12px;
  box-shadow: 0px 2px 9.4px 0px rgba(0, 0, 0, 0.08);
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

export const AddTaskContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  width: 100%;
`;

export const TaskInput = styled.input`
  width: 100%;
  height: 14px;
  padding: 15px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4caf50;
  }
`;

export const AddButton = styled.button`
  display: flex;
  padding: 16px;
  border-radius: 10px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  font-weight: 700;
  color: #7a7a7a;
  &:hover {
    background: #fff;
  }
`;

export const AddSecondButton = styled.button`
  background-color: transparent;
  font-size: 30px;
  margin-left: auto;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: #fff;
  }
`;
