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
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState();

  const createProjectapi = async (projectName, description, memberEmail) => {
    const invitedEmails = memberEmail ? [memberEmail] : [];
    try {
      const res = await axiosInstanceNoHeader.post("/project/register", {
        projectName: projectName,
        description: description,
        invitedEmails: invitedEmails,
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
      const res = await createProjectapi(projectName, description, memberEmail);
      console.log("modal보낸 바디:", projectName, description, memberEmail);
      console.log("modal받은 응답", res);

      // 프로젝트 생성 후 모달 닫기
      // setNewProjectCreateModalOpen(false);
    } catch (error) {
      console.log("에러 발생", error);
    }
  };

  return (
    <div className="w-[550px] h-[550px] flex flex-col justify-center items-center relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
      <div
        className="w-8 h-8 absolute right-[20px] top-[20px] cursor-pointer"
        onClick={() => setNewProjectCreateModalOpen(!newProjectCreateModalOpen)}
      >
        <CloseOn />
      </div>
      <form
        className="w-[450px] h-[400px] flex flex-col justify-between items-center gap-7"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <Input
            type={"text"}
            title={"프로젝트 이름"}
            placeholder={"프로젝트 이름을 입력해주세요."}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Input
            type={"text"}
            title={"프로젝트 설명"}
            placeholder={"프로젝트에 대한 설명을 입력해주세요."}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            required={false}
          />
        </div>
        <div className="w-full h-14">
          <Button
            type={"submit"}
            text={"프로젝트 만들기"}
            width={"100%"}
            height={"100%"}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProjectModal;
