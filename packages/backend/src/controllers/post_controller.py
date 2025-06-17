from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID
from ..models.post import Post, PostCreate, PostResponse
from ..models.comment import Comment, CommentCreate, CommentResponse
from ..models.vote import VoteCreate, VoteResponse
from ..models.database import Post as DBPost, User
from ..database.database import get_db
from ..middleware.auth import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=PostResponse)
async def create_post(
    post: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new post"""
    try:
        logger.info(f"Creating post: {post}")
        db_post = DBPost(
            title=post.title,
            content=post.content,
            forum_id=post.forum_id,
            user_id=post.user_id or current_user.id,
            votes=0
        )
        db.add(db_post)
        await db.commit()
        await db.refresh(db_post)
        logger.info(f"Created post successfully: {db_post.id}")
        return db_post
    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[PostResponse])
async def get_posts(
    forum_id: Optional[str] = Query(None, description="Filter posts by forum ID"),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> List[PostResponse]:
    """Get all posts, optionally filtered by forum_id"""
    try:
        query = select(DBPost).order_by(desc(DBPost.created_at))
        if forum_id:
            query = query.where(DBPost.forum_id == forum_id)
        query = query.limit(limit)
        result = await db.execute(query)
        posts = result.scalars().all()
        return posts
    except Exception as e:
        logger.error(f"Error getting posts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/posts/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> PostResponse:
    """
    Get a post by ID
    
    Args:
        post_id: Post ID from path
        db: Database session
        
    Returns:
        PostResponse: Post with matching ID
        
    Raises:
        HTTPException: If post not found
    """
    try:
        result = await db.execute(
            select(DBPost).where(DBPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(
    post_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> List[CommentResponse]:
    """
    Get all comments for a post, organized in a threaded structure
    
    Args:
        post_id: Post ID from path
        db: Database session
        
    Returns:
        List[CommentResponse]: List of comments with their replies
    """
    try:
        result = await db.execute(
            select(Comment)
            .where(Comment.post_id == post_id)
            .order_by(Comment.created_at)
        )
        comments = result.scalars().all()
        
        # Organize comments into a threaded structure
        comment_dict = {str(comment.id): comment for comment in comments}
        root_comments = []
        
        for comment in comments:
            if comment.parent_id is None:
                # This is a root comment
                root_comments.append(comment)
            else:
                # This is a reply
                parent = comment_dict.get(str(comment.parent_id))
                if parent:
                    if not hasattr(parent, 'replies'):
                        parent.replies = []
                    parent.replies.append(comment)
        
        return root_comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: UUID,
    comment: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CommentResponse:
    """
    Create a new comment or reply
    
    Args:
        post_id: Post ID from path
        comment: Comment data from request body
        db: Database session
        current_user: Authenticated user
        
    Returns:
        CommentResponse: Created comment
        
    Raises:
        HTTPException: If post not found or parent comment not found
    """
    try:
        result = await db.execute(
            select(DBPost).where(DBPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # If this is a reply, verify parent comment exists
        if comment.parent_id:
            result = await db.execute(
                select(Comment).where(Comment.id == comment.parent_id)
            )
            parent_comment = result.scalar_one_or_none()
            if not parent_comment or parent_comment.post_id != post_id:
                raise HTTPException(
                    status_code=404,
                    detail="Parent comment not found or does not belong to this post"
                )

        # Create comment
        db_comment = Comment(
            post_id=post_id,
            user_id=current_user.id,
            content=comment.content,
            parent_id=comment.parent_id
        )
        db.add(db_comment)
        await db.commit()
        await db.refresh(db_comment)
        return db_comment
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts/{post_id}/vote", response_model=VoteResponse)
async def vote_post(
    post_id: UUID,
    vote: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> VoteResponse:
    """Vote on a post"""
    try:
        result = await db.execute(
            select(DBPost).where(DBPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Check for existing vote
        result = await db.execute(
            select(VoteCreate)
            .where(VoteCreate.post_id == post_id)
            .where(VoteCreate.user_id == current_user.id)
        )
        existing_vote = result.scalar_one_or_none()

        if existing_vote:
            if existing_vote.vote_type == vote.vote_type:
                # Remove vote
                await db.delete(existing_vote)
                post.votes -= 1 if vote.vote_type == "up" else -1
            else:
                # Change vote
                existing_vote.vote_type = vote.vote_type
                post.votes += 2 if vote.vote_type == "up" else -2
        else:
            # Add new vote
            new_vote = VoteCreate(
                post_id=post_id,
                user_id=current_user.id,
                vote_type=vote.vote_type
            )
            db.add(new_vote)
            post.votes += 1 if vote.vote_type == "up" else -1

        await db.commit()
        return VoteResponse(votes=post.votes)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/comments/{comment_id}/vote", response_model=VoteResponse)
async def vote_comment(
    comment_id: UUID,
    vote: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> VoteResponse:
    """
    Vote on a comment
    
    Args:
        comment_id: Comment ID from path
        vote: Vote data from request body
        db: Database session
        current_user: Authenticated user
        
    Returns:
        VoteResponse: Updated vote count
        
    Raises:
        HTTPException: If comment not found or vote type invalid
    """
    try:
        result = await db.execute(
            select(Comment).where(Comment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        # Check for existing vote
        result = await db.execute(
            select(VoteCreate)
            .where(VoteCreate.comment_id == comment_id)
            .where(VoteCreate.user_id == current_user.id)
        )
        existing_vote = result.scalar_one_or_none()

        if existing_vote:
            if existing_vote.vote_type == vote.vote_type:
                # Remove vote
                await db.delete(existing_vote)
                comment.votes -= 1 if vote.vote_type == "up" else -1
            else:
                # Change vote
                existing_vote.vote_type = vote.vote_type
                comment.votes += 2 if vote.vote_type == "up" else -2
        else:
            # Add new vote
            new_vote = VoteCreate(
                comment_id=comment_id,
                user_id=current_user.id,
                vote_type=vote.vote_type
            )
            db.add(new_vote)
            comment.votes += 1 if vote.vote_type == "up" else -1

        await db.commit()
        return VoteResponse(votes=comment.votes)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Delete a post"""
    try:
        result = await db.execute(
            select(DBPost).where(DBPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
            
        if post.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this post")
            
        await db.delete(post)
        await db.commit()
        return {"message": "Post deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) 