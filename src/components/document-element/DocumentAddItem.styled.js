import styled from "styled-components";

const InputField = styled.input`
  padding: 8px;
  width: 20rem;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const AddDocumentButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 8px 12px;
  background-color: #63d676;
  color: white;
  border: none;
  font-size: 50px;
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SelectField = styled.select`
  padding: 8px;
  width: 8rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 4rem;
`;

export { InputField, AddDocumentButton, SelectField };
