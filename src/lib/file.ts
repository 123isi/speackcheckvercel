import axios from "axios";
import { apiClient, handleApiError } from "./api";

export async function getPresignedUrl(fileName: string): Promise<string> {
  try {
    console.log("📤 Presigned URL 요청:", fileName);
    const response = await apiClient.get<string>("https://speakcheck-back.onrender.com/files/presigned", {
      params: { fileName },
    });
    console.log("✅ Presigned URL 받음:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Presigned URL 요청 실패:", error);
    handleApiError(error);
  }
}

export async function uploadFileToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  try {
    console.log("📤 S3 업로드 시작:", presignedUrl);
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    console.log("✅ S3 업로드 완료");
  } catch (error) { 
    console.error("❌ S3 업로드 실패:", error);
    throw new Error("파일 업로드에 실패했습니다.");
  }
}

export async function uploadFileAndGetUrl(file: File): Promise<string> {
  try {
    console.log("📤 파일 업로드 시작:", file.name);
    
    // 1. Presigned URL 받기
    const presignedUrl = await getPresignedUrl(file.name);
    
    // 2. S3에 업로드
    await uploadFileToS3(presignedUrl, file);
    
    // 3. S3 URL 추출 (presigned URL에서 쿼리 파라미터 제거)
    const s3Url = presignedUrl.split("?")[0];
    console.log("✅ S3 URL:", s3Url);
    
    return s3Url;
  } catch (error) {
    console.error("❌ 파일 업로드 실패:", error);
    throw error;
  }
}