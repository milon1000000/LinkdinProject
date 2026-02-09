import React, { useContext, useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import moment from "moment";
import dp from "../assets/dp.webp";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { socket, userDataContext } from "../context/UserContext";
import ConnectionButton from "./ConnectionButton";

function Post({
  id,
  author,
  like,
  comment,
  description,
  image,
  createdAt,
  createdAtDate,
}) {
  const [more, setMore] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData, getPost, handleGetProfile } =
    useContext(userDataContext);
  const [likes, setLikes] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleLike = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      //  console.log(result)
      setLikes(result.data.post.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        {
          content: commentContent,
        },
        { withCredentials: true },
      );
      setComments(result.data.post.comment);
      setCommentContent("");

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (e) => {
    setIsDeleting(true);
    try {
      const result = await axios.delete(serverUrl + `/api/post/delete/${id}`, {
        withCredentials: true,
      });
      getPost();
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId === id) {
        setLikes(likes);
      }
    });

    socket.on("commentAdd", ({ postId, comment }) => {
      if (postId == id) {
        setComments(comment);
      }
    });

    return () => {
      socket.off("likeUpdated");
      socket.off("commentAdd");
    };
  }, [id]);

  useEffect(() => {
    setLikes(like);
    setComments(comment);
  }, [like, comment]);

  return (
    <div className="w-full min-h-[200px] bg-red-400 rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px]">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-start gap-[10px]">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
            onClick={() => {
              if (author?.userName) {
                handleGetProfile(author.userName);
              } else {
                console.log("userName not available", author);
              }
            }}
          >
            <img
              src={
                author?._id === userData?._id
                  ? userData?.profileImage?.url || dp
                  : author?.profileImage?.url || dp
              }
              alt={`${author?.firstName} ${author?.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div
              className="text-[15px] sm:text-[18px] lg:text-[22px] font-semibold"
              onClick={() => handleGetProfile(author.userName)}
            >{`${author.firstName} ${author.lastName}`}</div>
            <div
              className="text-[15px] sm:text-[18px] md:text-[22px] lg:text-[22px] font-semibold"
              onClick={() => handleGetProfile(author?.userName)}
            >
              {author?._id === userData?._id
                ? userData?.userName
                : author?.userName}
            </div>

            <div className="text-[14px] lg:text-[16px]">{`${author.headline}`}</div>
            <div className="text-[16px]">{`${moment(
              createdAt,
            ).fromNow()}`}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Connection Button: only when NOT own post */}
          {userData._id !== author._id && (
            <div className="hidden lg:flex">
              <ConnectionButton userId={author._id} />
            </div>
          )}

          {/* Three dots: only when OWN post */}
          {userData._id === author._id && (
            <div className="text-[25px] cursor-pointer">
              <HiOutlineDotsVertical
                onClick={() => setDeletePost((prev) => !prev)}
              />
            </div>
          )}

          {/* Delete box */}
          {deletePost && userData._id === author._id && (
            <div className="absolute top-10 right-0 w-44 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden z-50">
              <button
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={isDeleting} 
              >
                {isDeleting ? "Delete Processing..." : "Delete Post"}
              </button>

              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => setDeletePost(false)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`w-full ${
          !more ? "max-h-[100px] overflow-hidden" : ""
        } pl-[50px]`}
      >{`${description}`}</div>
      <div
        className="pl-[50px] text-[19px] font-semibold"
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "read less..." : "read more..."}
      </div>

      {image.url && (
        <div className="w-full  flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={image.url}
            alt=""
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      )}
      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500">
          <div className="flex items-center justify-center gap-[5px] text-[18px]">
            <BiLike className="text-[#1ebbff] w-[20px] h-[20px]" />
            <span>{likes.length}</span>
          </div>
          <div
            className="flex items-center justify-center gap-[5px] text-[18px]"
            onClick={() => setShowComment((prev) => !prev)}
          >
            {comments.length}
            <span>comment</span>
          </div>
        </div>
        <div className="flex justify-start items-center w-full p-[20px] gap-[20px]">
          {!likes.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <BiLike className="w-[24px] h-[24px]" />
              <span>Like</span>
            </div>
          )}
          {likes.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <BiSolidLike className="w-[24px] h-[24px] text-[#07a4ff] " />
              <span className="text-[#07a4ff] font-semibold">Liked</span>
            </div>
          )}

          <div
            className="flex justify-center items-center gap-[5px]"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <FaRegCommentDots />
            <span>comment</span>
          </div>
        </div>
        <div>
          <form
            className="w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]"
            onSubmit={handleComment}
          >
            <input
              type="text"
              placeholder="leave a comment"
              className="border-none outline-none text-[10px] sm:text-[17px] md:text-[18px] lg:text-[19px]"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />

            <button>
              <LuSendHorizontal className="text-[#07a4ff] w-[22px] h-5.5" />
            </button>
          </form>
          {showComment && (
            <div className="flex flex-col gap-[20px]">
              {comments.map((com) => {
                // fresh user profile check
                const commentUser =
                  com.user?._id === userData._id ? userData : com.user;

                return (
                  <div
                    key={com._id}
                    className="w-full flex gap-[10px] p-[20px] border-b-2 border-gray-300"
                  >
                    <div
                      className="w-12.5 h-12.5 rounded-full overflow-hidden"
                      onClick={() => {
                        if (com.user.userName) {
                          handleGetProfile(com.user.userName);
                        } else {
                          console.log("userName not available", author);
                        }
                      }}
                    >
                      <img
                        src={commentUser?.profileImage?.url || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[18px] font-semibold">{`${commentUser?.firstName} ${commentUser?.lastName}`}</div>
                      <div className="text-[17px]">{com.content}</div>
                      <div className="text-[13px] text-gray-500">
                        {com.createdAtDate
                          ? moment(com.createdAtDate).fromNow()
                          : "Just now"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
