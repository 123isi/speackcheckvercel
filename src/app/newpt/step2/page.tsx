"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useRef, useEffect, Suspense } from "react";
import { Back, Record, Document } from "../../../../public/svg";
import MediumButton from "@/components/button/MediumBtn";
import { submitVideoUrl, submitDocumentUrl } from "@/lib/api";
import { uploadFileAndGetUrl } from "@/lib/file";

function NewPresentationStep2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = useMemo(() => searchParams?.get("stageId") || null, [searchParams]);
  const speechId = useMemo(() => searchParams?.get("speechId") || null, [searchParams]);
  const title = useMemo(() => searchParams?.get("title") || "", [searchParams]);
  
  const videoFileRef = useRef<HTMLInputElement>(null);
  const docFileRef = useRef<HTMLInputElement>(null);
  
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  
  const [docUrl, setDocUrl] = useState<string>("");
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedVideoFile(file);
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleVideoFileReset = () => {
    if (videoFileRef.current) {
      videoFileRef.current.value = "";
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl("");
    setSelectedVideoFile(null);
  };

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedDocFile(file);
      if (docUrl) {
        URL.revokeObjectURL(docUrl);
      }
      const url = URL.createObjectURL(file);
      setDocUrl(url);
    }
  };

  const handleDocFileReset = () => {
    if (docFileRef.current) {
      docFileRef.current.value = "";
    }
    if (docUrl) {
      URL.revokeObjectURL(docUrl);
    }
    setDocUrl("");
    setSelectedDocFile(null);
  };

  const handleVideoUploadClick = () => {
    videoFileRef.current?.click();
  };

  const handleDocUploadClick = () => {
    docFileRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (docUrl) {
        URL.revokeObjectURL(docUrl);
      }
    };
  }, [videoUrl, docUrl]);

  const handleCreate = async () => {
    if (!stageId || !speechId) {
      router.push("/manage");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // 1. S3에 파일 업로드하고 URL 받기
      let videoS3Url: string | null = null;
      let docS3Url: string | null = null;

      if (selectedVideoFile) {
        videoS3Url = await uploadFileAndGetUrl(selectedVideoFile);
      }

      if (selectedDocFile) {
        docS3Url = await uploadFileAndGetUrl(selectedDocFile);
      }

      // 2. S3 URL을 API에 전송 (speechId 포함)
      const apiPromises: Promise<void>[] = [];

      if (videoS3Url) {
        apiPromises.push(submitVideoUrl(speechId, videoS3Url));
      }

      if (docS3Url) {
        apiPromises.push(submitDocumentUrl(speechId, docS3Url));
      }

      if (apiPromises.length > 0) {
        await Promise.all(apiPromises);
      }

      // 3. 로컬 스토리지에 저장
      const storageKey = `presentations:${stageId}`;
      const existing = localStorage.getItem(storageKey);
      const list: Array<{ id: string; title: string; createdAt: string }> = existing ? JSON.parse(existing) : [];
      const speechTitle = title && title.trim().length > 0 ? title.trim() : "무제 발표";
      const newItem = {
        id: speechId,
        title: speechTitle,
        createdAt: new Date().toISOString(),
      };
      const nextList = [newItem, ...list];
      localStorage.setItem(storageKey, JSON.stringify(nextList));

      // 4. 결과 페이지로 이동
      router.push(`/newpt/result?stageId=${encodeURIComponent(stageId)}&presentationId=${encodeURIComponent(speechId)}&title=${encodeURIComponent(speechTitle)}`);
    } catch (error: any) {
      console.error("업로드 실패:", error);
      
      let errorMessage = "파일 업로드에 실패했습니다.";
      if (error.status === 404) {
        errorMessage = "파일을 찾을 수 없습니다.";
      } else if (error.status === 500) {
        errorMessage = error.message || "업로드 할 수 있는 용량을 초과했습니다.";
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Page>
      <MainContainer>
        <FormCard>
          <HeaderRow>
            <BackButton onClick={() => router.back()} aria-label="뒤로 가기">
              <Back width={24} height={24} />
            </BackButton>
            <HeaderTitle>자료 업로드</HeaderTitle>
            <Spacer />
          </HeaderRow>

          <TitleDisplay>{title || "무제 발표"}</TitleDisplay>

          <FileInputContainer>
            <SectionLabel>발표 영상</SectionLabel>
            <HiddenFileInput
              type="file"
              accept="video/*"
              ref={videoFileRef}
              onChange={handleVideoFileChange}
              id="video-upload-input"
            />
            {!videoUrl ? (
              <UploadArea onClick={handleVideoUploadClick}>
                <UploadInner>
                  <Record width={60} height={60} />
                  <UploadText>발표 영상 업로드</UploadText>
                </UploadInner>
              </UploadArea>
            ) : (
              <VideoPreviewContainer>
                <VideoPreview src={videoUrl} controls />
                <FileInfo>
                  <FileName>{selectedVideoFile?.name}</FileName>
                  <DeleteButton type="button" onClick={handleVideoFileReset}>
                    삭제하기
                  </DeleteButton>
                </FileInfo>
              </VideoPreviewContainer>
            )}
          </FileInputContainer>

          <FileInputContainer>
            <SectionLabel>발표 자료</SectionLabel>
            <HiddenFileInput
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              ref={docFileRef}
              onChange={handleDocFileChange}
              id="doc-upload-input"
            />
            {!docUrl ? (
              <UploadArea onClick={handleDocUploadClick}>
                <UploadInner>
                  <Document width={60} height={60} />
                  <UploadText>발표 자료 업로드</UploadText>
                  <UploadSubText>PDF, PPT, PPTX, DOC, DOCX</UploadSubText>
                </UploadInner>
              </UploadArea>
            ) : (
              <FileInfo>
                <FileName>{selectedDocFile?.name}</FileName>
                <DeleteButton type="button" onClick={handleDocFileReset}>
                  삭제하기
                </DeleteButton>
              </FileInfo>
            )}
          </FileInputContainer>

          {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}

          <MediumButton 
            width={255} 
            onClick={handleCreate}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "새 모의 발표 생성"}
          </MediumButton>
        </FormCard>
      </MainContainer>

      <BottomNavigationBar />
    </Page>
  );
}

const Page = styled.div`
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
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  max-width: 375px;
`;

const FormCard = styled.div`
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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  width: 100%;
  margin-bottom: 12px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${color.form_pressing};
  }
`;

const HeaderTitle = styled.h2`
  flex: 1;
  text-align: center;
  margin: 0;
  font-family: ${font.P2};
  color: ${color.default};
`;

const Spacer = styled.div`
  width: 44px;
  height: 44px;
`;

const TitleDisplay = styled.div`
  width: 100%;
  padding: 16px;
  background-color: ${color.input};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  font-family: ${font.P2};
  color: ${color.default};
  text-align: center;
`;

const FileInputContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionLabel = styled.label`
  font-family: ${font.P2};
  color: ${color.default};
  font-weight: 600;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadArea = styled.div`
  border: 1px dashed ${color.stroke_lighter};
  border-radius: 8px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color.input};
  width: 100%;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${color.stroke};
  }
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const UploadText = styled.p`
  margin: 0;
  font-family: ${font.P2};
  color: ${color.default};
`;

const UploadSubText = styled.p`
  margin: 0;
  font-family: ${font.P2};
  font-size: 12px;
  color: ${color.caption};
`;

const VideoPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const VideoPreview = styled.video`
  width: 100%;
  max-height: 300px;
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

const ErrorMessage = styled.div`
  width: 100%;
  padding: 12px 16px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  font-family: ${font.P2};
  color: #c33;
  text-align: center;
`;

export default function NewPresentationStep2Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewPresentationStep2Content />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <Page>
      <MainContainer>
        <FormCard>
          <HeaderRow>
            <Spacer />
            <HeaderTitle>로딩 중...</HeaderTitle>
            <Spacer />
          </HeaderRow>
        </FormCard>
      </MainContainer>
      <BottomNavigationBar />
    </Page>
  );
}
