import styled from "styled-components";

const Info = () => {
  return (
    <Wrapper>
      <div>Information on decentralized identifiers and services</div>{" "}
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

export default Info;
