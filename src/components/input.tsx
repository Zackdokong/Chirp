import { useState } from "react";
import { supabase } from "../supabaseClient";

function Input() {
  const [detail, setDetail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageCheck, setImageCheck] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!detail.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ detail: detail, created_at: new Date()}])
        .select();

      if (error) {
        console.error("Error uploading post:", error);
        setError("게시물을 업로드하는 데 문제가 발생했습니다.");
        return;
      }

      if (data?.[0]?.id && image) {
        await supabase.from("posts").update({img: true}).eq("id", data[0].id);
        const filePath = `img/${data[0].id}`;

        const { error: fileError } = await supabase.storage
          .from("img")
          .upload(filePath, image);

        if (fileError) {
          console.error("Error uploading file:", fileError);
          setError("이미지 업로드 중 문제가 발생했습니다.");
          return;
        }
      }
      
      setDetail("");
      setImage(null);
      setImageCheck(false);
      window.location.reload();
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clickFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageCheck(true);
      setImage(e.target.files[0]);
    }
  };

  const uploadImageButton = () => {
    const fileInput = document.querySelector(".imgInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };
  return (
    <div className="input-wrapper">
      <textarea
        className="text-input"
        placeholder="하고 싶은 말을 보내보세요~"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        disabled={isSubmitting}
      ></textarea>
      <div className="button-wrapper">
        <div className="error-message">
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="imgInput-wrapper">
          <button className="imgInputButton" onClick={uploadImageButton}>
            {imageCheck ? "Image Added" : "Add Image"}
          </button>
          <input
            type="file"
            className="imgInput"
            accept="image/*"
            onChange={clickFileInput}
            style={{ display: "none" }}
          />
        </div>
        <button
          className="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !detail.trim()}
        >
          {isSubmitting ? "Uploading..." : "Wing It!"}
        </button>
      </div>
    </div>
  );
}

export default Input;
