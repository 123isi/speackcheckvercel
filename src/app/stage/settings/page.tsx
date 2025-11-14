"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import MediumButton from "@/components/button/MediumBtn";
import { useRouter } from "next/navigation";
import { Back, Upload, MainFront } from "../../../../public/svg";
import { useRef, useState, useEffect } from "react";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/file";
import { createStage } from "@/lib/stage";

export default function Create() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [situation, setSituation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleFileReset = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl("");
    setSelectedFile(null);
  };

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleComplete = async () => {
    const pendingName = sessionStorage.getItem("pendingStageName")?.trim();

    if (!pendingName) {
      alert("스테이지명을 입력해주세요.");
      return;
    }

    if (!situation.trim()) {
      alert("상황 설정을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      let checkListUrl = "";

      // Upload image to S3 if selected
      if (selectedFile) {
        console.log("S3 업로드 시작:", selectedFile.name);
        const presignedUrl = await getPresignedUrl(selectedFile.name);
        console.log("Presigned URL 받음:", presignedUrl);
        
        await uploadFileToS3(presignedUrl, selectedFile);
        console.log("S3 업로드 완료");
        
        // Extract the S3 URL (remove query params)
        checkListUrl = presignedUrl.split("?")[0];
      }

      // Create stage via API
      const response = await createStage({
        stageName: pendingName,
        situation: situation.trim(),
        checkList: checkListUrl || "",
      });

      console.log("스테이지 생성 완료:", response);
      sessionStorage.removeItem("pendingStageName");
      
      alert("스테이지가 생성되었습니다!");
      router.push("/manage");
    } catch (error) {
      console.error("Failed to create stage:", error);
      alert("스테이지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreatePage>
      <MainContainer>
        <FormContainer>
          <TopBar>
            <IconButton onClick={() => router.back()}>
              <Back width={24} height={24} />
            </IconButton>
            <TopBarTitle>새로운 스테이지</TopBarTitle>
            <IconPlaceholder />
          </TopBar>

          <Content>
            <FileInputContainer>
              <HiddenFileInput
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleFileChange}
                id="image-upload-input"
              />
              {!imageUrl ? (
                <UploadBox onClick={handleUploadClick}>
                  <UploadInner>
                    <Upload width={73} height={54} />
                    <UploadLabel>심사 기준표 업로드</UploadLabel>
                  </UploadInner>
                </UploadBox>
              ) : (
                <ImagePreviewContainer>
                  <ImagePreview
                    src={imageUrl}
                    alt="업로드된 이미지"
                  />
                  <FileInfo>
                    <FileName>{selectedFile?.name}</FileName>
                    <DeleteButton type="button" onClick={handleFileReset}>
                      삭제하기
                    </DeleteButton>
                  </FileInfo>
                </ImagePreviewContainer>
              )}
            </FileInputContainer>

            <Section>
              <SectionHeader>
                <MainFront width={46} height={36} />
                <SectionTitle>상황 설정</SectionTitle>
              </SectionHeader>
              <TextareaContainer>
                <Textarea
                  placeholder="구체적 상황 설정"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  disabled={isLoading}
                />
              </TextareaContainer>
            </Section>
            <MediumButton
              width={280}
              onClick={handleComplete}
              disabled={isLoading}
            >
              {isLoading ? "생성 중..." : "새 스테이지 생성"}
            </MediumButton>
          </Content>
        </FormContainer>
      </MainContainer>

      <BottomNavigationBar />
    </CreatePage>
  );
}

const CreatePage = styled.div`
  background-color: ${color.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  max-width: 375px;
`;

const FormContainer = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  width: 100%;
  padding: 64px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  width: 100%;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
`;

const IconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
`;

const TopBarTitle = styled.p`
  color: ${color.caption};
  text-align: center;
  font-family: ${font.P2};
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const FileInputContainer = styled.div`
  width: 100%;
  position: relative;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadBox = styled.div`
  background-color: ${color.input};
  border: 1px dashed ${color.stroke};
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${color.stroke_lighter};
  }
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
`;

const UploadLabel = styled.p`
  color: ${color.default};
  text-align: center;
  font-family: ${font.P2};
  margin: 0;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  background-color: ${color.input};
  border: 1px solid ${color.stroke_lighter};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${color.input};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
`;

const FileName = styled.p`
  margin: 0;
  font-family: ${font.P2};
  color: ${color.default};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  font-family: ${font.P2};
  color: ${color.caption};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${color.form_pressing};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
  width: 100%;
`;

const SectionTitle = styled.p`
  color: ${color.default};
  font-family: ${font.P2};
  margin: 0;
`;

const TextareaContainer = styled.div`
  background-color: ${color.input};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 132px;
  width: 100%;
  padding: 12px 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: ${color.default};
  font-family: ${font.P2};
  
  &::placeholder {
    color: ${color.caption};
  }
  
  &:focus {
    outline: none;
    border-color: ${color.primary};
  }
`;
 