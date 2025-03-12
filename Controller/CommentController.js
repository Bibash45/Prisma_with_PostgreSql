import prisma from "../DB/db.config.js";

export const fetchComment = async (req, res) => {
    const comments = await prisma.comment.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            post: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true
                        }
                    }
                }
            }
        }
    });
    return res.status(200).json({
        success: true,
        data: comments,
    });

}

// Show comment
export const showComment = async (req, res) => {
    const commentId = req.params.id;
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    })
    if (!comment) {
        return res.status(404).json({
            success: false,
            message: "comment not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: comment
    })
}

export const createComment = async (req, res) => {
    const {
        post_id,
        user_id,
        comment
    } = req.body;


    // Increase the comment count in the post table
    await prisma.post.update({
        where: {
            id: post_id
        },
        data: {
            comment_count: {
                increment: 1
            }
        }
    })

    const newComment = await prisma.comment.create({
        data: {
            post_id,
            user_id,
            comment
        },
    });

    return res.status(200).json({
        success: true,
        message: "comment created successfully",
    });
};

// Update the comment
export const updateComment = async (req, res) => {
    const commentId = req.params.id;
    const {
        post_id,
        user_id,
        comment
    } = req.body;

    await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            post_id,
            user_id,
            comment
        }
    })

    return res.status(200).json({
        success: true,
        message: "comment updated successfully"
    })
}

// Delete the comment
export const deleteComment = async (req, res) => {
    const commentId = req.params.id;


    const comment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

    // Decrease the comment count in the post table
    await prisma.post.update({
        where: {
            id: comment.post_id
        },
        data: {
            comment_count: {
                decrement: 1
            }
        }
    })

    return res.status(200).json({
        success: true,
        message: "comment deleted successfully"
    })
}