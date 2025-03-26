# icons 폴더 경로
BASE_PATH="/Users/munjaeyeong/Documents/2025/캡스톤디자인_졸프/frontend/src/assets/icons"

# icons 폴더 내 모든 하위 폴더에 대해 작업
for folder in "$BASE_PATH"/*/; do
  # 폴더 이름 추출
  folder_name=$(basename "$folder")
  
  # 파일 경로 생성
  file_path="${folder}${folder_name}-hover.jsx"
  
  # JSX 파일 생성 및 기본 React 컴포넌트 작성
  cat <<EOF > "$file_path"
import React from "react";

const ${folder_name}Hover = () => {
  return (
    <div>
      <p>${folder_name} Hover Component</p>
    </div>
  );
};

export default ${folder_name}Hover;
EOF

  echo "Created: $file_path"
done