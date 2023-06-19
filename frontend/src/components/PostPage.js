import React, {useState} from 'react';
import useFetchComments from './useFetchComments';
import {useParams, useNavigate} from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SearchList from './SearchList';
import useFetchPost from "./useFetchPost";
import CreateComment from "./CreateComment";
import EditPost from "./EditPost";
import {useAuth} from "./AuthContext";

const PostPage = () => {
    const {id} = useParams()
    const {post, setPost, isLoading} = useFetchPost(id)
    const {comments, setComments} = useFetchComments(id);
    const navigate = useNavigate()
    const {loggedUser} = useAuth()

    if (!loggedUser) {
        return null
    }
    return (
        <section>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="card" style={{maxWidth: '42rem', marginLeft: '375px'}}>
                    <div className="card-body">
                        <div className="d-flex mb-3" style={{borderBottom: '1px solid #b3acab'}}
                        >
                            <a href="">
                                <img
                                    src={post.user_profile_picture}
                                    className="border rounded-circle me-2"
                                    alt="Avatar"
                                    style={{height: '40px'}}
                                />
                            </a>
                            <div>
                                <p className="text-dark mb-0" onClick={() => navigate(`/profile/${post.user}`)}>
                                    <strong>{post.user}</strong>
                                </p>
                                <p className="text-muted d-block" style={{marginTop: '-6px'}}>
                                    <small>{post.posted_at}</small>
                                </p>
                            </div>
                            {post.user === loggedUser.username &&
                                <p className="text-muted d-block" style={{marginTop: '-6px'}}>
                                    <EditPost post={post} onEditCallback={setPost}/>
                                </p>}

                        </div>
                        <div>
                            <p>{post.description}</p>
                        </div>
                    </div>
                    <div className="bg-image hover-overlay ripple rounded-0" data-mdb-ripple-color="light">
                        <img src={post.image} style={{objectFit: 'contain', width: '100%', height: '100%'}}/>
                        <a href="#!">
                            <div className="mask" style={{backgroundColor: 'rgba(251, 251, 251, 0.2)'}}></div>
                        </a>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                            <div>
                                <div>
                                    <i className="fas fa-heart text-danger"></i>
                                    <span>{post.likes_count}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-muted">
                                    <i className="fas fa-comment-alt me-2"></i>{comments.length}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between text-center border-top border-bottom mb-4">
                            <button type="button" className="btn btn-link btn-lg" data-mdb-ripple-color="dark">
                                <i className="fas fa-thumbs-up me-2"></i>Like
                            </button>
                            <button type="button" className="btn btn-link btn-lg" data-mdb-ripple-color="dark">
                                <i className="fas fa-comment-alt me-2"></i>Comment
                            </button>
                        </div>
                        <div className="d-flex mb-3">
                            <a href="">
                                <img
                                    src={loggedUser.profile_picture}
                                    className="border rounded-circle me-2"
                                    alt="Avatar"
                                    style={{height: '40px'}}
                                />
                            </a>
                            <CreateComment post_id={id} onAddCallback={setComments} old={comments}/>
                        </div>
                        {comments.map((comment) => (
                            <div className="d-flex mb-3"
                                 onClick={() => navigate(`/profile/${comment.user}`)}>
                                <img
                                    src={comment.user_profile_picture}
                                    className="border rounded-circle me-2"
                                    alt="Avatar"
                                    style={{height: '40px'}}
                                />
                                <div>
                                    <div className="bg-light rounded-3 px-3 py-1">
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                        }}>
                                            <p className="text-dark mb-0">
                                                <strong>{comment.user}</strong>
                                            </p>
                                            <p>
                                                <small>{comment.timestamp}</small>
                                            </p>
                                        </div>
                                        <div style={{position: 'relative'}}>
                                                    <span style={{
                                                        borderBottom: '1px solid #b3acab',
                                                        position: 'absolute',
                                                        width: '100%',
                                                        marginTop: '-15px'
                                                    }}></span>
                                        </div>
                                        <p className="text-muted d-block">
                                            <small>{comment.text}</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default PostPage;