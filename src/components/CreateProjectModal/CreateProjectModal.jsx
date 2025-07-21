import React, { useState } from "react";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const CreateProjectModal = ({
  setNewProjectCreateModalOpen,
  newProjectCreateModalOpen,
}) => {
  const [projectName, setProjectName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const createProjectapi = async (projectName, memberEmail) => {
    try {
      const res = await axiosInstanceNoHeader.post("/project/register", {
        projectId: "",
        projectName: projectName,
        description: "test description",
        invitedEmails: [memberEmail],
      });
      console.log("프로젝트 생성 성공~!\n", res);
      alert("프로젝트가 생성되었습니다.");

      return res;
    } catch (error) {
      console.log("프로젝트 생성 실패~!\n", error);
      return error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProjectapi(projectName, memberEmail);
      console.log("보낸 바디:", projectName, memberEmail);
      console.log("받은 응답", res);

      // 프로젝트 생성 후 모달 닫기
      // setNewProjectCreateModalOpen(false);
    } catch (error) {
      console.log("에러 발생", error);
    }
  };

  return (
    <div className="w-[550px] h-[550px] flex flex-col justify-center items-center relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
      <div
        className="w-10 h-10 absolute rounded-2xl right-[20px] top-[20px] cursor-pointer"
        onClick={() => setNewProjectCreateModalOpen(!newProjectCreateModalOpen)}
      >
        <CloseOn />
      </div>
      <div className="w-[450px] h-[400px] flex flex-col justify-start items-center gap-7">
        <form
          className="w-full flex flex-col justify-center items-center gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            type={"text"}
            title={"프로젝트 이름"}
            placeholder={"프로젝트 이름을 입력해주세요."}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Input
            type="text"
            title={"멤버"}
            placeholder={"프로젝트에 참여할 멤버의 이메일을 입력해주세요."}
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            onBlur={() => {
              // 이메일 형식 검증 로직 추가 가능
            }}
            className="w-[400px] h-[50px] bg-gray-100 rounded-lg px-4 outline-none"
          />
          <button className="w-full h-14" type="submit">
            <Button text={"프로젝트 만들기"} width={"100%"} height={"100%"} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
