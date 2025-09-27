import React, { useState } from "react";
import CloseOn from "../../assets/icons/Close/CloseOn";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { axiosInstanceNoHeader } from "../../apis/axiosInstance";

const CreateProjectModal = ({
  setNewProjectCreateModalOpen,
  newProjectCreateModalOpen,
  setSidebarOpen,
  onProjectCreated,
}) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberEmailList, setMemberEmailList] = useState([]);
  const [onSuccess, setOnSuccess] = useState(null);
  const [errMessage, setErrMessage] = useState("");

  // 이메일 형식 검증
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 이메일 유효성 검사
  const handleIsUserEmail = async (email) => {
    if (!validateEmail(email)) {
      setOnSuccess(false);
      setErrMessage("유효하지 않은 이메일 형식입니다.");
      return;
    }
    try {
      const res = await axiosInstanceNoHeader.get("/project/invite", {
        params: { email },
      });
      setOnSuccess(true);
      return res;
    } catch (e) {
      setOnSuccess(false);
      setErrMessage(e.response?.data?.message || "이메일 확인 실패");
      return e;
    }
  };

  // 프로젝트 생성 API
  const createProjectapi = async (projectName, description) => {
    const invitedEmails = memberEmailList.length > 0 ? memberEmailList : [];
    try {
      const res = await axiosInstanceNoHeader.post("/project/register", {
        projectName,
        description,
        invitedEmails,
      });
      alert("프로젝트가 생성되었습니다.");
      setNewProjectCreateModalOpen(false);
      setSidebarOpen(false);

      if (onProjectCreated) onProjectCreated(); // 리스트 최신화

      return res;
    } catch (error) {
      console.log("프로젝트 생성 실패:", error);
      return error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProjectapi(projectName, description);
  };

  return (
    <div className="w-[550px] h-[550px] flex flex-col justify-center items-center relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
      {/* 닫기 버튼 */}
      <div
        className="w-8 h-8 absolute right-[20px] top-[20px] cursor-pointer"
        onClick={() => setNewProjectCreateModalOpen(!newProjectCreateModalOpen)}
      >
        <CloseOn />
      </div>
      {/* 프로젝트 생성 폼 */}
      <form
        className="w-[450px] h-[400px] flex flex-col justify-between items-center gap-7"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-center items-start gap-3">
          {/* 프로젝트 이름 */}
          <Input
            type="text"
            title="프로젝트 이름"
            placeholder="프로젝트 이름을 입력해주세요."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          {/* 프로젝트 설명 */}
          <Input
            type="text"
            title="프로젝트 설명"
            placeholder="프로젝트에 대한 설명을 입력해주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* 멤버 이메일 */}
          <Input
            type="text"
            title="멤버"
            placeholder="프로젝트 멤버의 이메일을 입력해주세요."
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            onBlur={() => handleIsUserEmail(memberEmail)}
            required={false}
            useButton={true}
            onSuccess={onSuccess}
            onClick={() => {
              if (onSuccess === true) {
                if (memberEmailList.includes(memberEmail)) {
                  setErrMessage("이미 초대목록에 추가된 이메일입니다.");
                  setOnSuccess(false);
                  return;
                }
                setErrMessage("");
                setMemberEmailList([...memberEmailList, memberEmail]);
                setOnSuccess(null); // 상태 초기화
                setMemberEmail(""); // 입력창 초기화
              }
            }}
            errmsg={errMessage}
          />
          {/* 멤버 이메일 리스트 */}
          {memberEmailList.length > 0 && (
            <div className="w-full flex flex-col justify-start items-start gap-2 font-[Palanquin]">
              <div className="text-gray-800 text-base font-semibold">
                초대할 멤버 목록
              </div>
              <ul className="w-full max-h-24 list-disc pl-1 overflow-y-auto">
                {memberEmailList.map((email, index) => (
                  <li
                    key={index}
                    className="text-gray-700 w-full h-6 flex justify-between"
                  >
                    {email}
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        setMemberEmailList(
                          memberEmailList.filter((e) => e !== email)
                        )
                      }
                    >
                      <CloseOn />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="w-full h-14">
          <Button
            type="submit"
            text="프로젝트 만들기"
            width="100%"
            height="100%"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProjectModal;
