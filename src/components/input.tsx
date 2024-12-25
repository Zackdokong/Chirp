import { useState } from "react";
import { supabase } from "../supabaseClient";

function Input() {
  const [detail, setDetail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!detail.trim()) return; // 빈 입력 방지
    setIsSubmitting(true);
    setError(null);

    try {
        const { data, error } = await supabase
        .from('posts')
        .insert([{ detail: detail, created_at: new Date() }]);      
      if (error) {
        console.error("Error uploading post:", error);
        setError("게시물을 업로드하는 데 문제가 발생했습니다.");
      } else {
        console.log("Post uploaded:", data);
        setDetail(''); // 입력 초기화
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }

  };

  return (
    <div className="input-wrapper">
      <textarea
        className="text-input"
        placeholder="What's happening?"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        disabled={isSubmitting}
      ></textarea>
      <div className="button-wrapper">
        <div className="error-message">{error && <p className="error-message">{error}</p>}</div>
        <button className="button" onClick={handleSubmit} disabled={isSubmitting || !detail.trim()}>
          {isSubmitting ? "Uploading..." : "Chirp"}
        </button>
      </div>
    </div>
  );
}

export default Input;
