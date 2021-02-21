import styled from "styled-components";

const CreateService = () => {
  return (
    <Wrapper>
      <div>Create a new service for use in a did document</div>{" "}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: calc(100vh - 50px);
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  section {
    p {
      font-size: 20px;
    }
  }
`;

export default CreateService;
