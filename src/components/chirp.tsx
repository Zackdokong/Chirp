import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  created_at: Date;
  detail: string;
  like: number;
  dislike: number;
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


  const AddLike = async (id: number) => {
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("like")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching current like count:", fetchError);
      return;
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({ like: (currentPost?.like || 0) + 1 })
      .eq("id", id);

    if (updateError) {
      console.error("Error adding like:", updateError);
    } else {
      fetchPosts();
    }
  };

  const AddDislike = async (id: number) => {
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("dislike")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching current dislike count:", fetchError);
      return;
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({ dislike: (currentPost?.dislike || 0) + 1 })
      .eq("id", id);

    if (updateError) {
      console.error("Error adding dislike:", updateError);
    } else {
      fetchPosts();
    }
  };

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
            <div className="like-dislike-wrapper">
              <div className="chirp-button-wrapper">
                <button className="like-button" onClick={() => AddLike(post.id)}>좋아요</button>
                <p className="like-count">{post.like}</p>
              </div>
              <div className="chirp-button-wrapper">
                <button className="dislike-button" onClick={() => AddDislike(post.id)}>싫어요</button>
                <p className="dislike-count">{post.dislike}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
  
}

export default Chirp;
