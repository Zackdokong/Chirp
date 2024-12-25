import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';

interface Post {
  created_at: Date;
  detail: string;
}

function Chirp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("posts") // 테이블 이름
        .select("*") // 모든 필드를 가져옴
        .order("created_at", { ascending: false }); // 최신순으로 정렬
      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }
  
      if (data) {
        console.log("Fetched posts:", data); // 데이터를 확인
        setPosts(data); // 상태 업데이트
      }
    } catch (err) {
      console.error("Unexpected error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="chirp-wrapper">
      {isLoading ? (
        <p>게시물을 불러오는 중...</p>
      ) : posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index} className="chirp">
            <p className="chirp-time">
              {new Date(post.created_at).toLocaleString('ko-KR')}
            </p>
            <p className="chirp-text">{post.detail}</p>
          </div>
        ))
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
  
}

export default Chirp;
